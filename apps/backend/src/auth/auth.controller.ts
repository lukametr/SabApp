import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  BadRequestException,
  Query,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from '../users/dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMe(@Request() req: any) {
    console.log('📍 /auth/me called for user:', {
      email: req.user?.email,
      id: req.user?.id,
      sub: req.user?.sub,
    });

    // JwtStrategy.validate returns an object with `id`, not `sub`.
    // However, keep compatibility with tokens that include `sub`.
    const userId = req.user?.id || req.user?.sub;
    const user = await this.usersService.findById(userId);

    if (!user) {
      console.error('❌ User not found for ID:', userId);
      throw new NotFoundException('User not found');
    }

    return {
      id: String(user._id),
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      phoneNumber: user.phoneNumber,
      organization: user.organization,
      position: user.position,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user with email and password' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: any): Promise<AuthResponseDto> {
    return this.authService.registerWithEmail(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: any): Promise<AuthResponseDto> {
    console.log('🔐 Login attempt for:', loginDto?.email);
    try {
      const result = await this.authService.loginWithEmail(loginDto);
      console.log('✅ Login successful for:', loginDto?.email);
      return result;
    } catch (error: any) {
      console.error('❌ Login failed:', {
        email: loginDto?.email,
        message: error?.message,
        code: error?.response?.code,
        status: error?.status,
      });
      throw error;
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id || req.user.sub);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      status: user.status,
      // ...existing code...
      phoneNumber: user.phoneNumber,
      organization: user.organization,
      position: user.position,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
      status: user.status,
      // ...existing code...
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async verifyEmail(@Query('token') token: string) {
    try {
      if (!token) {
        throw new BadRequestException('Verification token is required');
      }

      // Find user by verification token
      const user = await this.usersService.findByVerificationToken(token);
      if (!user) {
        throw new BadRequestException('Invalid verification token');
      }

      // Check if token is expired
      if (
        user.emailVerificationTokenExpires &&
        user.emailVerificationTokenExpires < new Date()
      ) {
        throw new BadRequestException('Verification token has expired');
      }

      // Mark email as verified
      await this.usersService.verifyEmail(String(user._id));

      return {
        message: 'Email verified successfully. You can now login.',
        success: true,
      };
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(
    @Request() req: any,
    @Body() updateData: UpdateProfileDto,
  ) {
    const userId = req.user.id || req.user.sub;
    const updatedUser = await this.usersService.updateProfile(
      userId,
      updateData,
    );

    // აბრუნე სრული user ობიექტი ყველა ველით
    return {
      id: String(updatedUser._id),
      email: updatedUser.email,
      name: updatedUser.name,
      phoneNumber: updatedUser.phoneNumber,
      organization: updatedUser.organization,
      position: updatedUser.position,
      picture: updatedUser.picture,
      role: updatedUser.role,
      status: updatedUser.status,
      isEmailVerified: updatedUser.isEmailVerified,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized or invalid current password',
  })
  async changePassword(
    @Request() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id || req.user.sub;
    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
