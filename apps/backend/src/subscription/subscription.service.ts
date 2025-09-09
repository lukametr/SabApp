import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
  SubscriptionStatus,
  UserStatus,
} from '../users/schemas/user.schema';
import { Cron, CronExpression } from '@nestjs/schedule';

export interface GrantSubscriptionDto {
  userId: string;
  days: number;
  paymentAmount?: number;
  paymentNote?: string;
}

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async grantSubscription(dto: GrantSubscriptionDto): Promise<UserDocument> {
    const { userId, days, paymentAmount, paymentNote } = dto;

    this.logger.log(`Granting ${days} days subscription to user ${userId}`);

    let user = await this.userModel.findById(userId);
    if (!user) {
      // Try to find by string conversion
      user = await this.userModel.findById(userId.toString());
      if (!user) {
        throw new Error('User not found');
      }
    }

    const now = new Date();
    let endDate = new Date(now);

    // If user has active subscription, extend from current end date
    if (
      user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      user.subscriptionEndDate &&
      user.subscriptionEndDate > now
    ) {
      endDate = new Date(user.subscriptionEndDate);
    }

    // Add days to end date
    endDate.setDate(endDate.getDate() + days);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStartDate: user.subscriptionStartDate || now,
        subscriptionEndDate: endDate,
        subscriptionDays: (user.subscriptionDays || 0) + days,
        lastPaymentDate: now,
        paymentAmount: paymentAmount || 0,
        paymentNote: paymentNote || '',
        status: UserStatus.ACTIVE, // Reactivate user if suspended
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('Failed to update user subscription');
    }

    this.logger.log(
      `Subscription granted to ${user.email} until ${endDate.toISOString()}`,
    );
    return updatedUser;
  }

  async revokeSubscription(
    userId: string,
    reason?: string,
  ): Promise<UserDocument> {
    this.logger.log(`Revoking subscription for user ${userId}`);

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      {
        subscriptionStatus: SubscriptionStatus.CANCELLED,
        status: UserStatus.SUSPENDED,
        paymentNote: reason || 'Subscription revoked by admin',
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('Failed to revoke user subscription');
    }

    this.logger.log(`Subscription revoked for user ${userId}`);
    return updatedUser;
  }

  async checkUserSubscription(userId: string): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) return false;

    const now = new Date();

    // Check if subscription is active and not expired
    if (
      user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      user.subscriptionEndDate &&
      user.subscriptionEndDate > now
    ) {
      return true;
    }

    // If subscription expired, update status
    if (
      user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      user.subscriptionEndDate &&
      user.subscriptionEndDate <= now
    ) {
      await this.userModel.findByIdAndUpdate(userId, {
        subscriptionStatus: SubscriptionStatus.EXPIRED,
        status: UserStatus.SUSPENDED,
      });
      this.logger.log(`Subscription expired for user ${user.email}`);
    }

    return false;
  }

  async getSubscriptionInfo(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const now = new Date();
    const isActive =
      user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      user.subscriptionEndDate &&
      user.subscriptionEndDate > now;

    const daysRemaining = user.subscriptionEndDate
      ? Math.max(
          0,
          Math.ceil(
            (user.subscriptionEndDate.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

    return {
      status: user.subscriptionStatus,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
      daysRemaining,
      isActive,
      totalDays: user.subscriptionDays,
      lastPayment: {
        date: user.lastPaymentDate,
        amount: user.paymentAmount,
        note: user.paymentNote,
      },
    };
  }

  // Daily cron job to check expired subscriptions
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkExpiredSubscriptions() {
    this.logger.log('Running daily subscription check...');

    const now = new Date();

    // Find users with active subscriptions that have expired
    const expiredUsers = await this.userModel.find({
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      subscriptionEndDate: { $lte: now },
    });

    this.logger.log(`Found ${expiredUsers.length} expired subscriptions`);

    for (const user of expiredUsers) {
      await this.userModel.findByIdAndUpdate(user._id, {
        subscriptionStatus: SubscriptionStatus.EXPIRED,
        status: UserStatus.SUSPENDED,
      });

      this.logger.log(`Expired subscription for user: ${user.email}`);
    }

    this.logger.log('Daily subscription check completed');
  }

  // Get all users with subscription info for admin panel
  async getAllUsersWithSubscription() {
    const users = await this.userModel
      .find(
        {},
        {
          password: 0, // Exclude password
        },
      )
      .sort({ createdAt: -1 });

    return users.map((user) => {
      const now = new Date();
      const isActive =
        user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
        user.subscriptionEndDate &&
        user.subscriptionEndDate > now;

      const daysRemaining = user.subscriptionEndDate
        ? Math.max(
            0,
            Math.ceil(
              (user.subscriptionEndDate.getTime() - now.getTime()) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0;

      const userObject = user.toObject();

      // Ensure we have both _id and id fields for frontend compatibility
      const result = {
        ...userObject,
        id: (userObject._id as any).toString(), // Ensure id is a string
        _id: (userObject._id as any).toString(), // Also include _id as string
        subscription: {
          isActive,
          daysRemaining,
          status: user.subscriptionStatus,
        },
      };

      return result;
    });
  }
}
