import { Controller, Post, Body, Get, UseGuards, Request, Res, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthResponseDto, CompleteRegistrationDto } from '../users/dto/google-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { Response } from 'express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @ApiOperation({ summary: 'Initiate Google OAuth flow' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  async initiateGoogleAuth(@Res() res: Response) {
    try {
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
      const redirectUri = `${backendUrl}/auth/google/callback`;
      
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=code&` +
        `scope=email profile&` +
        `access_type=offline&` +
        `prompt=consent`;
      
      console.log('🔗 Redirecting to Google OAuth:', googleAuthUrl);
      return res.redirect(googleAuthUrl);
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      return res.redirect('/?error=Google OAuth initialization failed');
    }
  }

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already exists or data conflict' })
  async googleAuth(@Body() authDto: any): Promise<AuthResponseDto> {
    // Handle NextAuth Google provider payload
    if (authDto.googleId && authDto.email && authDto.name) {
      return this.authService.handleNextAuthGoogle(authDto);
    }
    // Handle legacy Google auth
    return this.authService.googleAuth(authDto);
  }

  @Post('google/complete-registration')
  @ApiOperation({ summary: 'Complete Google user registration with additional info' })
  @ApiResponse({ status: 200, description: 'Registration completed successfully', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async completeGoogleRegistration(@Body() registrationDto: CompleteRegistrationDto): Promise<AuthResponseDto> {
    return this.authService.googleAuth(registrationDto);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async googleCallback(@Request() req: any, @Res() res: Response) {
    try {
      // Handle Google OAuth callback
      const { code, state } = req.query;
      
      console.log('🧪 OAuth Callback Debug:', {
        hasCode: !!code,
        codeLength: code?.length || 0,
        state: state,
        fullQuery: req.query
      });
      
      if (!code) {
        console.log('❌ OAuth Error: No authorization code received');
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://saba-app-production.up.railway.app';
        return res.redirect(`${frontendUrl}/?error=Authorization code is required`);
      }

      console.log('🔄 OAuth: Starting token exchange...');
      // Exchange code for tokens and get user info
      const result = await this.authService.handleGoogleCallback(code, state);
      console.log('✅ OAuth: Token exchange successful');

      // Get frontend URL for redirect
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://saba-app-production.up.railway.app';

      // For Railway deployment - redirect to frontend with token
      if (result.accessToken) {
        console.log('✅ OAuth: Redirecting to frontend with token');
        const successUrl = `${frontendUrl}/?auth=success&token=${result.accessToken}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
        return res.redirect(successUrl);
      } else {
        console.log('❌ OAuth Error: No access token received');
        return res.redirect(`${frontendUrl}/?error=Authentication failed`);
      }
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://saba-app-production.up.railway.app';
      return res.redirect(`${frontendUrl}/?error=${encodeURIComponent(error.message || 'Authentication failed')}`);
    }
  }

  @Post('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback (POST)' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async googleCallbackPost(@Body() body: { code: string; state: string }) {
    try {
      const { code, state } = body;
      
      if (!code) {
        throw new BadRequestException('Authorization code is required');
      }

      // Exchange code for tokens and get user info
      const result = await this.authService.handleGoogleCallback(code, state);
      return result;
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user with email and password' })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: any): Promise<AuthResponseDto> {
    return this.authService.registerWithEmail(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: any): Promise<AuthResponseDto> {
    return this.authService.loginWithEmail(loginDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req: any) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
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
    };
  }

  @Get('admin/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users list retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAllUsers() {
    const users = await this.usersService.findAll();
    return users.map(user => ({
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
      if (user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()) {
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
}