import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { SubscriptionService } from '../../subscription/subscription.service';
import { UserRole } from '../../users/schemas/user.schema';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
    }

    // Admin users bypass subscription check
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // Check if user has active subscription
    const hasActiveSubscription = await this.subscriptionService.checkUserSubscription(
      user._id || user.id
    );

    if (!hasActiveSubscription) {
      throw new HttpException(
        {
          message: 'Subscription required',
          error: 'SUBSCRIPTION_REQUIRED',
          details: 'Your subscription has expired. Please contact admin for renewal.',
        },
        HttpStatus.PAYMENT_REQUIRED
      );
    }

    return true;
  }
}
