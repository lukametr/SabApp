import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { IUser } from '../models/User';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    private configService: ConfigService
  ) {
    const stripeSecretKey = this.configService.get<string>('stripe.secretKey');
    if (!stripeSecretKey) {
      throw new Error('Stripe secret key is not defined');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    });
  }

  async createCheckoutSession(user: IUser): Promise<Stripe.Checkout.Session> {
    const priceId = this.configService.get<string>('stripe.priceId');
    const frontendUrl = this.configService.get<string>('frontend.url');
    return this.stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
      },
    });
  }

  async getSubscriptionStatus(user: IUser): Promise<{ status: string }> {
    const subscription = await this.subscriptionModel.findOne({ userId: user._id });
    if (!subscription) {
      return { status: 'inactive' };
    }
    if (subscription.cancelAtPeriodEnd) {
      return { status: 'cancelling' };
    }
    return { status: subscription.status };
  }

  async cancelSubscription(user: IUser): Promise<void> {
    const subscription = await this.subscriptionModel.findOne({ userId: user._id });
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    await this.subscriptionModel.findByIdAndUpdate(subscription._id, {
      cancelAtPeriodEnd: true,
    });
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await this.handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeletion(event.data.object as Stripe.Subscription);
        break;
    }
  }

  private async handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    await this.subscriptionModel.findOneAndUpdate(
      { userId },
      {
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      { upsert: true }
    );
  }

  private async handleSubscriptionDeletion(subscription: Stripe.Subscription): Promise<void> {
    const userId = subscription.metadata.userId;
    await this.subscriptionModel.findOneAndDelete({ userId });
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    const subscription = await this.subscriptionModel.findOne({ userId });
    return subscription?.status === 'active' && !subscription?.cancelAtPeriodEnd;
  }
} 