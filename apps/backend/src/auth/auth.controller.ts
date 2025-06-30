import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { GoogleAuthDto, AuthResponseDto } from '../users/dto/google-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('auth')
@Controller('api/auth')
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
      personalNumber: user.personalNumber,
      phoneNumber: user.phoneNumber,
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
      personalNumber: user.personalNumber,
      phoneNumber: user.phoneNumber,
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }
} 