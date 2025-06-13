import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<SubscriptionDocument>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get('subscription.stripeSecretKey'), {
      apiVersion: '2023-10-16',
    });
  }

  async createSubscription(userId: string, paymentMethodId: string): Promise<Subscription> {
    // შევქმნათ ან ვიპოვოთ Stripe კლიენტი
    const user = await this.subscriptionModel.findOne({ userId });
    let customerId: string;

    if (user?.stripeCustomerId) {
      customerId = user.stripeCustomerId;
    } else {
      const customer = await this.stripe.customers.create({
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      customerId = customer.id;
    }

    // შევქმნათ აბონემენტი
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: this.configService.get('subscription.monthlyPriceId') }],
      expand: ['latest_invoice.payment_intent'],
    });

    // შევინახოთ აბონემენტი ბაზაში
    const newSubscription = new this.subscriptionModel({
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });

    return newSubscription.save();
  }

  async getSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findOne({ userId });
    if (!subscription) {
      throw new NotFoundException('აბონემენტი ვერ მოიძებნა');
    }
    return subscription;
  }

  async cancelSubscription(userId: string): Promise<Subscription> {
    const subscription = await this.getSubscription(userId);
    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    subscription.cancelAtPeriodEnd = true;
    return this.subscriptionModel.findByIdAndUpdate((subscription as any)._id, { cancelAtPeriodEnd: true }, { new: true });
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await this.subscriptionModel.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        );
        break;
      }
    }
  }

  async isSubscriptionActive(userId: string): Promise<boolean> {
    try {
      const subscription = await this.getSubscription(userId);
      return subscription.status === 'active' && !subscription.cancelAtPeriodEnd;
    } catch {
      return false;
    }
  }

  async update(id: string, updateSubscriptionDto: any) {
    const subscription = await this.subscriptionModel.findById(id);
    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    return this.subscriptionModel.findByIdAndUpdate(id, updateSubscriptionDto, { new: true });
  }
} 