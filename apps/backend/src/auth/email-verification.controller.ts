import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

@Controller('auth')
export class EmailVerificationController {
  constructor(private usersService: UsersService) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    if (!token) throw new BadRequestException('Token is required');
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();
    // Redirect to frontend with success
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?success=1`,
    );
  }
}
