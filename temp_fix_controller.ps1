# Create a temporary subscription controller without roles guard for testing
Write-Host "Creating temporary controller for testing..." -ForegroundColor Yellow

$tempController = @'
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { SubscriptionService } from './subscription.service';
import { GetUser } from '../auth/decorators/get-user.decorator';

export class GrantSubscriptionDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(1)
  days: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paymentAmount?: number;

  @IsOptional()
  @IsString()
  paymentNote?: string;
}

export class RevokeSubscriptionDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // Admin endpoint to grant subscription to a user (TEMPORARILY REMOVE ROLES GUARD)
  @Post('grant')
  // @UseGuards(RolesGuard)  // COMMENTED OUT FOR TESTING
  // @Roles(UserRole.ADMIN)  // COMMENTED OUT FOR TESTING
  async grantSubscription(@Body() grantDto: GrantSubscriptionDto, @GetUser() user: any) {
    try {
      console.log('🔍 Grant subscription called by user:', user.email, 'role:', user.role);
      console.log('📋 Grant data:', grantDto);
      
      const result = await this.subscriptionService.grantSubscription(grantDto);
      return {
        message: 'Subscription granted successfully',
        data: result,
      };
    } catch (error) {
      console.error('❌ Grant subscription error:', error);
      throw new HttpException(
        error.message || 'Failed to grant subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Admin endpoint to revoke subscription
  @Put('revoke')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async revokeSubscription(@Body() revokeDto: RevokeSubscriptionDto) {
    try {
      const result = await this.subscriptionService.revokeSubscription(
        revokeDto.userId,
        revokeDto.reason,
      );
      return {
        message: 'Subscription revoked successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to revoke subscription',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Get current user's subscription status
  @Get('my-status')
  async getMySubscriptionStatus(@GetUser() user: any) {
    try {
      const subscription = await this.subscriptionService.getSubscriptionInfo(
        user._id || user.id,
      );
      const isActive = await this.subscriptionService.checkUserSubscription(
        user._id || user.id,
      );
      
      return {
        subscription,
        isActive,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get subscription status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin endpoint to get all users with subscription info
  @Get('users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsersWithSubscription() {
    try {
      const users = await this.subscriptionService.getAllUsersWithSubscription();
      return {
        message: 'Users retrieved successfully',
        data: users,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin endpoint to check a user's subscription status
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserSubscription(@Param('userId') userId: string) {
    try {
      const subscription = await this.subscriptionService.getSubscriptionInfo(userId);
      const isActive = await this.subscriptionService.checkUserSubscription(userId);
      
      return {
        subscription,
        isActive,
      };
    } catch (error) {
      throw new HttpException(
        'Failed to get user subscription',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
'@

# Save to a temporary file
$tempController | Out-File -FilePath "c:\Users\lukacode\Desktop\saba_latest\apps\backend\src\subscription\subscription.controller.temp.ts" -Encoding UTF8

Write-Host "Temporary controller created. Now backing up original and replacing..." -ForegroundColor Yellow

# Backup original
Copy-Item "c:\Users\lukacode\Desktop\saba_latest\apps\backend\src\subscription\subscription.controller.ts" "c:\Users\lukacode\Desktop\saba_latest\apps\backend\src\subscription\subscription.controller.backup.ts"

# Replace with temp version
Copy-Item "c:\Users\lukacode\Desktop\saba_latest\apps\backend\src\subscription\subscription.controller.temp.ts" "c:\Users\lukacode\Desktop\saba_latest\apps\backend\src\subscription\subscription.controller.ts"

Write-Host "Controller replaced. Testing locally first..." -ForegroundColor Green
