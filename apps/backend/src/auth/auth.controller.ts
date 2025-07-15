import { Controller, Post, Body, Get, UseGuards, Request, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { GoogleAuthDto, AuthResponseDto, CompleteRegistrationDto } from '../users/dto/google-auth.dto';
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
  ) {}

  @Post('google')
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiResponse({ status: 200, description: 'Successfully authenticated', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already exists or data conflict' })
  async googleAuth(@Body() authDto: GoogleAuthDto): Promise<AuthResponseDto> {
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
      
      if (!code) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Authorization code is required'
        });
      }

      // Exchange code for tokens and get user info
      const result = await this.authService.handleGoogleCallback(code, state);

      // Return JSON response instead of redirect for API consistency
      return res.json(result);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Authentication failed',
        error: error.message
      });
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
      // personalNumber: user.personalNumber, // Field removed
      // phoneNumber: user.phoneNumber, // Field removed
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
      // personalNumber: user.personalNumber, // Field removed
      // phoneNumber: user.phoneNumber, // Field removed
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
}