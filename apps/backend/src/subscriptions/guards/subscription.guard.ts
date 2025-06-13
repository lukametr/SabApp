import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SubscriptionsService } from '../subscriptions.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('ავტორიზაცია საჭიროა');
    }

    const hasActiveSubscription = await this.subscriptionsService.isSubscriptionActive(user.id);
    
    if (!hasActiveSubscription) {
      throw new UnauthorizedException('აქტიური აბონემენტი საჭიროა');
    }

    return true;
  }
} 