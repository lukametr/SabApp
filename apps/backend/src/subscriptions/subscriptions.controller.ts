import { Controller, Post, Body, UseGuards, Request, Get, Headers, RawBodyRequest } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import Stripe from 'stripe';

@ApiTags('subscriptions')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'ახალი აბონემენტის შექმნა' })
  @ApiResponse({ status: 201, description: 'აბონემენტი წარმატებით შეიქმნა' })
  async createSubscription(
    @Request() req,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    return this.subscriptionsService.createSubscription(req.user.id, paymentMethodId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  @ApiOperation({ summary: 'აბონემენტის სტატუსის მიღება' })
  @ApiResponse({ status: 200, description: 'წარმატებული მიღება' })
  async getSubscriptionStatus(@Request() req) {
    return this.subscriptionsService.getSubscription(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  @ApiOperation({ summary: 'აბონემენტის გაუქმება' })
  @ApiResponse({ status: 200, description: 'აბონემენტი წარმატებით გაუქმდა' })
  async cancelSubscription(@Request() req) {
    return this.subscriptionsService.cancelSubscription(req.user.id);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook handler' })
  @ApiResponse({ status: 200, description: 'წარმატებული დამუშავება' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Request() req: RawBodyRequest<ExpressRequest>,
  ) {
    const event = Stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    return this.subscriptionsService.handleWebhook(event);
  }
} 