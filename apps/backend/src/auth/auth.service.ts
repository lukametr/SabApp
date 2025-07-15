import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
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
    console.log('≡ƒöº Auth Service - Google Client ID configured:', !!googleClientId);
    console.log('≡ƒöº Auth Service - Google Client ID length:', googleClientId?.length || 0);
    
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async validateGoogleToken(idToken: string): Promise<GoogleUserInfo> {
    try {
      console.log('≡ƒöº Validating Google token...');
      const audience = this.configService.get<string>('GOOGLE_CLIENT_ID');
      console.log('≡ƒöº Google Client ID for verification:', !!audience);
      
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: audience,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        console.error('≡ƒöº Google token validation failed: No payload');
        throw new UnauthorizedException('Invalid Google token');
      }

      if (!payload.sub || !payload.email || !payload.name) {
        console.error('≡ƒöº Google token validation failed: Missing required fields', {
          hasSub: !!payload.sub,
          hasEmail: !!payload.email,
          hasName: !!payload.name
        });
        throw new UnauthorizedException('Invalid Google token payload');
      }

      console.log('≡ƒöº Google token validated successfully for user:', payload.email);

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        email_verified: payload.email_verified || false,
      };
    } catch (error) {
      console.error('≡ƒöº Google token validation error:', error.message);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async googleAuth(authDto: GoogleAuthDto): Promise<AuthResponseDto> {
    console.log('≡ƒöº Google Auth - Starting authentication process');
    console.log('≡ƒöº Google Auth - ID Token present:', !!authDto.idToken);
    console.log('≡ƒöº Google Auth - Personal Number:', authDto.personalNumber);
    console.log('≡ƒöº Google Auth - Phone Number:', authDto.phoneNumber);

    try {
      // Validate Google token
      const googleUserInfo = await this.validateGoogleToken(authDto.idToken);
      console.log('≡ƒöº Google Auth - Token validated successfully for:', googleUserInfo.email);

      // Check if user exists
      let user = await this.usersService.findByGoogleId(googleUserInfo.sub);

      if (!user) {
        console.log('≡ƒöº Google Auth - New user registration');
        // New user registration - check if additional info is provided
        if (!authDto.personalNumber || !authDto.phoneNumber) {
          // Return special response indicating registration is needed
          throw new BadRequestException({
            message: 'Additional registration information required',
            code: 'REGISTRATION_REQUIRED',
            userInfo: googleUserInfo
          });
        }
        
        // Create new user
        user = await this.usersService.createUser(
          googleUserInfo,
          authDto.personalNumber,
          authDto.phoneNumber,
        );
        console.log('≡ƒöº Google Auth - New user created successfully');
      } else {
        console.log('≡ƒöº Google Auth - Existing user login');
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

      console.log('≡ƒöº Google Auth - JWT token generated successfully');

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
      console.error('≡ƒöº Google Auth - Error:', error);
      throw error;
    }
  }

  async handleGoogleCallback(code: string, _state: string): Promise<AuthResponseDto> {
    try {
      console.log('≡ƒöº Handling Google OAuth callback with code:', !!code);
      
      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: this.configService.get<string>('GOOGLE_CLIENT_ID') || '',
          client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
          redirect_uri: `${this.configService.get<string>('FRONTEND_URL') || 'https://saba-app-production.up.railway.app'}/auth/google/callback`,
          grant_type: 'authorization_code',
        } as Record<string, string>),
      });

      if (!tokenResponse.ok) {
        throw new UnauthorizedException('Failed to exchange authorization code');
      }

      const tokens = await tokenResponse.json() as { id_token: string; access_token: string; };
      
      // Validate the ID token
      const googleUserInfo = await this.validateGoogleToken(tokens.id_token);
      
      // Check if user exists
      let user = await this.usersService.findByGoogleId(googleUserInfo.sub);

      if (!user) {
        // New user - this should trigger registration flow
        throw new BadRequestException({
          message: 'Additional registration information required',
          code: 'REGISTRATION_REQUIRED',
          userInfo: googleUserInfo
        });
      }

      // Existing user login
      await this.usersService.updateLastLogin(String(user._id));

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

      console.log('≡ƒöº Google OAuth callback - JWT token generated successfully');

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
      console.error('≡ƒöº Google OAuth callback - Error:', error);
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

  async registerWithEmail(registerDto: any): Promise<AuthResponseDto> {
    try {
      console.log('≡ƒöº Email Registration - Starting:', registerDto.email);
      
      // Validate required fields
      if (!registerDto.email || !registerDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      if (!registerDto.firstName || !registerDto.lastName) {
        throw new BadRequestException('First name and last name are required');
      }

      if (!registerDto.personalNumber || !registerDto.phoneNumber) {
        throw new BadRequestException('Personal number and phone number are required');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

      // Create user with email/password
      const user = await this.usersService.createEmailUser({
        email: registerDto.email,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
        personalNumber: registerDto.personalNumber,
        phoneNumber: registerDto.phoneNumber,
        password: hashedPassword,
        organization: registerDto.organization,
        position: registerDto.position,
      });

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

      console.log('≡ƒöº Email Registration - Success:', user.email);

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
      console.error('≡ƒöº Email Registration - Error:', error);
      throw error;
    }
  }

  async loginWithEmail(loginDto: any): Promise<AuthResponseDto> {
    try {
      console.log('🔐 Email Login - Starting:', loginDto.email);

      if (!loginDto.email || !loginDto.password) {
        console.error('🔐 Email Login - Missing credentials');
        throw new BadRequestException('Email and password are required');
      }

      // Find user by email
      console.log('🔐 Email Login - Looking up user by email:', loginDto.email);
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        console.error('🔐 Email Login - User not found:', loginDto.email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - User found:', { 
        id: user._id, 
        email: user.email, 
        hasPassword: !!user.password,
        status: user.status,
        lastLoginAt: user.lastLoginAt
      });

      // Verify password using bcrypt
      if (!user.password) {
        console.error('🔐 Email Login - User has no password hash');
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - Comparing passwords...');
      console.log('🔐 Email Login - Debug info:', {
        inputPasswordLength: loginDto.password.length,
        storedHashLength: user.password.length,
        hashPrefix: user.password.substring(0, 7), // Should show $2a$ or $2b$
        bcryptVersion: require('bcryptjs').version || 'unknown'
      });
      
      let isPasswordValid = false;
      
      try {
        isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        console.log('🔐 Email Login - bcrypt.compare result:', isPasswordValid);
        
        // If bcrypt fails and hash is $2a$ format, try creating new hash
        if (!isPasswordValid && user.password.startsWith('$2a$')) {
          console.log('🔐 Email Login - Detected $2a$ hash, attempting compatibility fix...');
          
          // Create a new $2b$ hash and update the user's password
          const newHash = await bcrypt.hash(loginDto.password, 10);
          console.log('🔐 Email Login - Created new $2b$ hash');
          
          // Update user's password hash in database
          await this.usersService.updateUserPassword(String(user._id), newHash);
          console.log('🔐 Email Login - Updated user password hash to $2b$ format');
          
          // Verify the new hash works
          isPasswordValid = await bcrypt.compare(loginDto.password, newHash);
          console.log('🔐 Email Login - New hash verification result:', isPasswordValid);
        }
        
      } catch (bcryptError) {
        console.error('🔐 Email Login - bcrypt error:', bcryptError);
        throw new UnauthorizedException('Password verification failed');
      }
      
      console.log('🔐 Email Login - Final password validation result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.error('🔐 Email Login - Password mismatch for user:', user.email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - Password verified successfully');

      // Update last login
      console.log('🔐 Email Login - Updating last login time...');
      await this.usersService.updateLastLogin(String(user._id));

      // Generate JWT token
      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        status: user.status,
      };

      console.log('🔐 Email Login - Generating JWT token...');
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
      });

      console.log('🔐 Email Login - Success for user:', user.email);

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
      console.error('🔐 Email Login - Error:', error);
      throw error;
    }
  }
}