import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post('checkout')
  async createCheckoutSession(@Request() req: any) {
    return this.subscriptionsService.createCheckoutSession(req.user);
  }

  @Post('cancel')
  async cancelSubscription(@Request() req: any) {
    return this.subscriptionsService.cancelSubscription(req.user);
  }
} 