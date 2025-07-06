import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service';
import { GoogleAuthDto, GoogleUserInfo, AuthResponseDto } from '../users/dto/google-auth.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    console.log('🔧 Auth Service - Google Client ID configured:', !!googleClientId);
    console.log('🔧 Auth Service - Google Client ID length:', googleClientId?.length || 0);
    
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async validateGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      if (!payload.sub || !payload.email || !payload.name) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified || false,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async googleAuth(authDto: GoogleAuthDto): Promise<AuthResponseDto> {
    console.log('🔧 Google Auth - Starting authentication process');
    console.log('🔧 Google Auth - ID Token present:', !!authDto.idToken);
    console.log('🔧 Google Auth - Personal Number:', authDto.personalNumber);
    console.log('🔧 Google Auth - Phone Number:', authDto.phoneNumber);

    try {
      // Validate Google token
      const googleUserInfo = await this.validateGoogleToken(authDto.idToken);
      console.log('🔧 Google Auth - Token validated successfully for:', googleUserInfo.email);

      // Check if user exists
      let user = await this.usersService.findByGoogleId(googleUserInfo.sub);

      if (!user) {
        console.log('🔧 Google Auth - New user registration');
        // New user registration - validate required fields
        if (!authDto.personalNumber || !authDto.phoneNumber) {
          throw new BadRequestException('Personal number and phone number are required for new users');
        }
        
        // Create new user
        user = await this.usersService.createUser(
          googleUserInfo,
          authDto.personalNumber,
          authDto.phoneNumber,
        );
        console.log('🔧 Google Auth - New user created successfully');
      } else {
        console.log('🔧 Google Auth - Existing user login');
        // Existing user login - update last login
        await this.usersService.updateLastLogin(String(user._id));
      }

      // Generate JWT token
      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        status: user.status,
      };

      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      });

      console.log('🔧 Google Auth - JWT token generated successfully');

      return {
        accessToken,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          status: user.status,
          personalNumber: user.personalNumber,
          phoneNumber: user.phoneNumber,
        },
      };
    } catch (error) {
      console.error('🔧 Google Auth - Error:', error);
      throw error;
    }
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
} 