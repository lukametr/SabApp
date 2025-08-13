import { Controller, Post, Body, Get, UseGuards, Request, Res, BadRequestException, Query, NotFoundException, Patch } from '@nestjs/common';
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
import { UpdateProfileDto } from '../users/dto/update-profile.dto';

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
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';
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
        console.error('❌ No authorization code received');
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://sabapp.com';
        return res.redirect(`${frontendUrl}/login?error=no_code`);
      }

      console.log('🔄 OAuth: Starting token exchange...');
      const authResponse = await this.authService.handleGoogleCallback(code, state);
      console.log('✅ OAuth: Token exchange successful');
      console.log('✅ OAuth: Auth response received:', {
        hasToken: !!authResponse.accessToken,
        userEmail: authResponse.user?.email
      });

      // Redirect with token
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://sabapp.com';
      const redirectUrl = `${frontendUrl}/auth/callback?token=${authResponse.accessToken}`;
      
      console.log('✅ OAuth: Redirecting to frontend with token');
      console.log('✅ OAuth: Redirect URL:', redirectUrl);
      
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('❌ OAuth callback error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'https://sabapp.com';
      const errorMessage = encodeURIComponent(error.message || 'oauth_error');
      return res.redirect(`${frontendUrl}/login?error=${errorMessage}`);
    }
  }

  @Post('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback (POST)' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async googleCallbackPost(@Body() body: { code: string; state: string }) {
    console.log('🔧 BACKEND Google Callback POST called with:', {
      hasCode: !!body.code,
      codeLength: body.code?.length || 0,
      state: body.state,
      bodyKeys: Object.keys(body || {})
    });
    
    try {
      const { code, state } = body;
      console.log('🔧 BACKEND Calling handleGoogleCallback...');
      
      const result = await this.authService.handleGoogleCallback(code, state);
      
      console.log('🔧 BACKEND Google callback result:', {
        hasUser: !!result.user,
        hasAccessToken: !!result.accessToken,
        userEmail: result.user?.email,
        userId: result.user?.id
      });
      
      return result;
    } catch (error) {
      console.error('🔧 BACKEND Google callback error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({ status: 200, description: 'User information retrieved successfully' })
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
      googleId: user.googleId,
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

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Request() req: any, @Body() updateData: UpdateProfileDto) {
    const userId = req.user.id || req.user.sub;
    const updatedUser = await this.usersService.updateProfile(userId, updateData);
    
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
      updatedAt: updatedUser.updatedAt
    };
  }
}
