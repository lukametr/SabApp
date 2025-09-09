import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '../utils/email';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import {
  GoogleAuthDto,
  GoogleUserInfo,
  AuthResponseDto,
} from '../users/dto/google-auth.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  // Centralized JWT signing to ensure consistent error handling and messages
  private signToken(payload: Record<string, any>): string {
    try {
      // Leverage JwtModule configuration (secret and expiresIn) from AuthModule
      return this.jwtService.sign(payload);
    } catch (err: any) {
      const msg = err?.message || String(err);
      console.error('❌ JWT signing failed:', msg);
      if (
        msg.includes('secretOrPrivateKey') ||
        msg.includes('secret or private key')
      ) {
        throw new BadRequestException({
          message: 'Authentication unavailable: JWT secret not configured',
          code: 'JWT_SECRET_MISSING',
        });
      }
      throw err;
    }
  }

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    console.log(
      '≡ƒöº Auth Service - Google Client ID configured:',
      !!googleClientId,
    );
    console.log(
      '≡ƒöº Auth Service - Google Client ID length:',
      googleClientId?.length || 0,
    );
    console.log(
      '🔐 Auth Service - JWT secret configured:',
      !!this.configService.get<string>('JWT_SECRET'),
    );

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
        console.error(
          '≡ƒöº Google token validation failed: Missing required fields',
          {
            hasSub: !!payload.sub,
            hasEmail: !!payload.email,
            hasName: !!payload.name,
          },
        );
        throw new UnauthorizedException('Invalid Google token payload');
      }

      console.log(
        '≡ƒöº Google token validated successfully for user:',
        payload.email,
      );
      console.log('≡ƒöº Google user sub (ID):', payload.sub);

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
    console.log(
      '≡ƒöº Google Auth - Starting authentication process (code or access_token)',
    );
    try {
      let googleUserInfo: GoogleUserInfo | null = null;
      if (authDto.code) {
        // Exchange code for tokens
        const tokenResponse = await fetch(
          'https://oauth2.googleapis.com/token',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              code: authDto.code,
              client_id:
                this.configService.get<string>('GOOGLE_CLIENT_ID') || '',
              client_secret:
                this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
              redirect_uri: `${this.configService.get<string>('NEXT_PUBLIC_API_URL') || 'https://sabapp.com/api'}/auth/google/callback`,
              grant_type: 'authorization_code',
            } as Record<string, string>),
          },
        );
        if (!tokenResponse.ok) {
          throw new UnauthorizedException(
            'Failed to exchange authorization code',
          );
        }
        const tokens = (await tokenResponse.json()) as {
          id_token: string;
          access_token: string;
        };
        googleUserInfo = await this.validateGoogleToken(tokens.id_token);
      } else if ((authDto as any).idToken) {
        // Support direct Google ID token (One Tap / Credentials API)
        googleUserInfo = await this.validateGoogleToken(
          (authDto as any).idToken,
        );
      } else if (authDto.accessToken) {
        // Fallback: use access_token to get userinfo
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          {
            headers: {
              Authorization: `Bearer ${authDto.accessToken}`,
              Accept: 'application/json',
            },
          },
        );
        if (!userInfoResponse.ok) {
          throw new UnauthorizedException('Failed to fetch Google user info');
        }
        const userInfo = (await userInfoResponse.json()) as {
          id: string;
          email: string;
          name?: string;
          given_name?: string;
          picture?: string;
          verified_email?: boolean;
        };
        googleUserInfo = {
          sub: userInfo.id,
          email: userInfo.email,
          name: userInfo.name || userInfo.given_name || '',
          picture: userInfo.picture,
          email_verified: userInfo.verified_email || false,
        };
      } else {
        throw new BadRequestException('Neither code nor accessToken provided');
      }

      // დამატებითი ველები frontend-დან
      const name = authDto['name'] || googleUserInfo.name;
      const organization = authDto['organization'] || undefined;
      const position = authDto['position'] || undefined;

      console.log('🔐 Processing Google login for:', googleUserInfo.email);

      // Improved user lookup logic
      let user = await this.usersService.findByGoogleId(googleUserInfo.sub);

      if (!user) {
        console.log('🔍 User not found by Google ID, checking by email...');
        // Try by email
        user = await this.usersService.findByEmail(googleUserInfo.email);

        if (user && !user.googleId) {
          // Link Google ID to existing email user
          console.log('🔗 Linking Google account to existing user');
          await this.usersService.linkGoogleId(
            String(user._id),
            googleUserInfo.sub,
          );
          user = await this.usersService.findById(String(user._id));
        }
      }

      if (!user) {
        console.log(
          '👤 Creating new user from Google OAuth:',
          googleUserInfo.email,
        );
        // Create new user
        user = await this.usersService.createUser({
          ...googleUserInfo,
          name,
          organization,
          position,
        });
        console.log(
          '✅ New Google user created successfully:',
          googleUserInfo.email,
        );
      } else {
        console.log('✅ Existing user login:', user.email);
        // Existing user login - update last login
        await this.usersService.updateLastLogin(String(user._id));
      }

      // Enhanced JWT payload with all necessary fields
      const payload = {
        sub: String(user._id),
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
        status: user.status || 'active',
        googleId: user.googleId,
        authProvider: user.authProvider || 'google',
        isEmailVerified: user.isEmailVerified || true,
      };

      const accessToken = this.signToken(payload);

      console.log(
        '≡ƒöº Google OAuth callback - JWT token generated successfully',
      );
      console.log('≡ƒöº JWT payload:', {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
        status: payload.status,
      });

      return {
        accessToken,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          status: user.status || 'active',
          googleId: user.googleId,
          authProvider: user.authProvider || 'google',
          isEmailVerified: user.isEmailVerified || true,
        },
      };
    } catch (error) {
      console.error('≡ƒöº Google Auth - Error:', error);
      throw error;
    }
  }

  async handleGoogleCallback(
    code: string,
    _state: string,
  ): Promise<AuthResponseDto> {
    try {
      console.log('≡ƒöº Handling Google OAuth callback with code:', !!code);

      const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
      const clientSecret =
        this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
      const backendUrl =
        this.configService.get<string>('NEXT_PUBLIC_API_URL') ||
        'https://sabapp.com/api';
      const redirectUri = `${backendUrl}/auth/google/callback`;

      console.log('🔧 OAuth Config Debug:', {
        hasClientId: !!clientId,
        clientIdLength: clientId.length,
        hasClientSecret: !!clientSecret,
        clientSecretLength: clientSecret.length,
        redirectUri,
        backendUrl,
      });

      // Exchange authorization code for tokens
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        } as Record<string, string>),
      });

      console.log('≡ƒöº Token response status:', tokenResponse.status);

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.log('≡ƒöº Token exchange error:', errorText);
        throw new UnauthorizedException(
          'Failed to exchange authorization code',
        );
      }

      const tokens = (await tokenResponse.json()) as {
        id_token: string;
        access_token: string;
      };

      // Validate the ID token
      const googleUserInfo = await this.validateGoogleToken(tokens.id_token);

      console.log('🔍 Google user info:', {
        sub: googleUserInfo.sub,
        email: googleUserInfo.email,
        name: googleUserInfo.name,
      });

      // Check if user exists
      let user = await this.usersService.findByGoogleId(googleUserInfo.sub);

      if (!user) {
        console.log('🔍 User not found by Google ID, checking by email...');
        // Check if user exists by email (maybe registered with email/password)
        user = await this.usersService.findByEmail(googleUserInfo.email);

        if (user) {
          // Link existing user with Google account
          console.log(
            '🔗 Linking existing user with Google account:',
            googleUserInfo.email,
          );
          await this.usersService.linkGoogleId(
            String(user._id),
            googleUserInfo.sub,
          );
          // Refresh user data
          user = await this.usersService.findById(String(user._id));
        } else {
          // Create new user with Google data
          console.log(
            '👤 Creating new user from Google OAuth:',
            googleUserInfo.email,
          );
          user = await this.usersService.createUser(googleUserInfo);

          if (!user) {
            console.error('❌ CRITICAL: createUser returned null/undefined!');
            throw new Error('Failed to create user');
          }

          console.log('✅ New Google user created successfully:', user.email);
        }
      } else {
        console.log('✅ Existing Google user found:', user.email);
      }

      if (!user) {
        console.error(
          '❌ CRITICAL: No user object available for JWT generation!',
        );
        throw new Error('User not found or created');
      }

      // Existing user login
      await this.usersService.updateLastLogin(String(user._id));

      // Generate JWT token with comprehensive user data
      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
      };

      const access_token = this.signToken(payload);

      console.log(
        '≡ƒöº Google OAuth callback - JWT token generated successfully',
      );
      console.log('≡ƒöº JWT payload:', payload);

      return {
        accessToken: access_token,
        user: {
          id: String(user._id),
          email: user.email,
          name: user.name,
          picture: user.picture,
          role: user.role,
          status: user.status,
          googleId: user.googleId,
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

      // Removed personalNumber and phoneNumber validation

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      // Generate email verification token before user creation
      const emailVerificationToken = randomBytes(32).toString('hex');
      const emailVerificationTokenExpires = new Date(
        Date.now() + 1000 * 60 * 60 * 24,
      ); // 24h

      // Create user with email/password and verification token
      const user = await this.usersService.createEmailUser({
        email: registerDto.email,
        name: `${registerDto.firstName} ${registerDto.lastName}`,
        password: hashedPassword,
        organization: registerDto.organization,
        position: registerDto.position,
        emailVerificationToken,
        emailVerificationTokenExpires,
      });

      console.log('≡ƒöº Email Registration - Success:', user.email);
      // Send verification email (do not fail registration if email fails)
      let emailSent = true;
      try {
        await sendVerificationEmail(user.email, emailVerificationToken);
      } catch (e) {
        emailSent = false;
        console.error(
          '📧 Email sending failed during registration (continuing):',
          e?.message || e,
        );
      }

      // Return success without JWT token - user must verify email first
      return {
        message: emailSent
          ? 'Registration successful. Please check your email to verify your account.'
          : 'Registration successful. Verification email could not be sent right now. Please try resending later or contact support.',
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          status: user.status,
        },
        requiresEmailVerification: true,
        emailSent,
      } as any;
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
        authProvider: user.authProvider,
        googleId: !!user.googleId,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
      });

      // Check if user has Google ID (Google account)
      if (user.googleId) {
        console.error(
          '🔐 Email Login - Google account attempted email login:',
          {
            email: user.email,
            googleId: !!user.googleId,
            hasPassword: !!user.password,
            authProvider: user.authProvider,
          },
        );
        throw new BadRequestException({
          message:
            'This account was created with Google. Please use "Sign in with Google" button instead.',
          code: 'GOOGLE_ACCOUNT_ONLY',
          email: user.email,
          authProvider: user.authProvider || 'google',
        });
      }

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
        bcryptVersion: require('bcryptjs').version || 'unknown',
      });

      let isPasswordValid = false;

      try {
        isPasswordValid = await bcrypt.compare(
          loginDto.password,
          user.password,
        );
        console.log('🔐 Email Login - bcrypt.compare result:', isPasswordValid);

        // If bcrypt fails and hash is $2a$ format, try creating new hash
        if (!isPasswordValid && user.password.startsWith('$2a$')) {
          console.log(
            '🔐 Email Login - Detected $2a$ hash, attempting compatibility fix...',
          );

          // Create a new $2b$ hash and update the user's password
          const newHash = await bcrypt.hash(loginDto.password, 10);
          console.log('🔐 Email Login - Created new $2b$ hash');

          // Update user's password hash in database
          await this.usersService.updateUserPassword(String(user._id), newHash);
          console.log(
            '🔐 Email Login - Updated user password hash to $2b$ format',
          );

          // Verify the new hash works
          isPasswordValid = await bcrypt.compare(loginDto.password, newHash);
          console.log(
            '🔐 Email Login - New hash verification result:',
            isPasswordValid,
          );
        }
      } catch (bcryptError) {
        console.error('🔐 Email Login - bcrypt error:', bcryptError);
        throw new UnauthorizedException('Password verification failed');
      }

      console.log(
        '🔐 Email Login - Final password validation result:',
        isPasswordValid,
      );

      if (!isPasswordValid) {
        console.error(
          '🔐 Email Login - Password mismatch for user:',
          user.email,
        );
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - Password verified successfully');

      // Update last login
      console.log('🔐 Email Login - Updating last login time...');
      await this.usersService.updateLastLogin(String(user._id));

      // Generate JWT token with comprehensive user data
      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        picture: user.picture,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
      };

      console.log('🔐 Email Login - Generating JWT token...');
      const accessToken = this.signToken(payload);

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
          // Removed personalNumber and phoneNumber
        },
      };
    } catch (error: any) {
      console.error('🔐 Email Login - Error:', {
        message: error?.message,
        name: error?.name,
        code: error?.code,
      });
      const msg = String(error?.message || '');
      // JWT secret misconfig handled here as well (belt and suspenders)
      if (
        msg.includes('secretOrPrivateKey') ||
        msg.includes('secret or private key')
      ) {
        throw new BadRequestException({
          message: 'Authentication unavailable: JWT secret not configured',
          code: 'JWT_SECRET_MISSING',
        });
      }
      // Database connectivity issues
      if (
        error?.name === 'MongoNetworkError' ||
        error?.name === 'MongooseServerSelectionError' ||
        msg.includes('ECONNREFUSED') ||
        msg.includes('getaddrinfo') ||
        msg.includes('ENOTFOUND') ||
        msg.includes('Server selection timed out')
      ) {
        throw new BadRequestException({
          message: 'Authentication temporarily unavailable',
          code: 'DB_UNAVAILABLE',
        });
      }
      // Pass through known HTTP exceptions (BadRequest/Unauthorized)
      if (error?.status && error?.response) {
        throw error;
      }
      // Fallback generic error
      throw new BadRequestException({
        message: 'Login failed',
        code: 'LOGIN_FAILED',
      });
    }
  }

  // NextAuth Google authentication handler
  async handleNextAuthGoogle(userData: any): Promise<AuthResponseDto> {
    try {
      console.log(
        '🔐 NextAuth Google - Starting authentication:',
        userData.email,
      );

      // Check if user exists by Google ID
      let user = await this.usersService.findByGoogleId(userData.googleId);

      if (!user) {
        // Check if user exists by email (migration case)
        user = await this.usersService.findByEmail(userData.email);

        if (!user) {
          console.log('🔐 NextAuth Google - Creating new user');
          // Create new user
          user = await this.usersService.createUser({
            sub: userData.googleId,
            email: userData.email,
            name: userData.name,
            picture: userData.picture,
            email_verified: true,
          });
        } else {
          console.log(
            '🔐 NextAuth Google - Linking existing email user to Google',
          );
          // Link existing email user to Google ID
          await this.usersService.linkGoogleId(
            String(user._id),
            userData.googleId,
          );
        }
      } else {
        console.log('🔐 NextAuth Google - Existing Google user login');
        // Update last login
        await this.usersService.updateLastLogin(String(user._id));
      }

      // Generate JWT token with comprehensive user data
      const payload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
        status: user.status,
        name: user.name,
        picture: user.picture,
        googleId: user.googleId,
        authProvider: user.authProvider,
        isEmailVerified: user.isEmailVerified,
      };

      const accessToken = this.signToken(payload);

      console.log('🔐 NextAuth Google - Success for user:', user.email);

      return {
        accessToken,
        user: {
          id: String(user._id),
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          status: user.status,
        },
      };
    } catch (error) {
      console.error('🔐 NextAuth Google - Error:', error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.usersService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('მომხმარებელი ვერ მოიძებნა');
      }

      // Check if user has a password (for Google OAuth users)
      if (!user.password) {
        throw new BadRequestException(
          'ამ ანგარიშისთვის პაროლის შეცვლა შეუძლებელია',
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('მიმდინარე პაროლი არასწორია');
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      await this.usersService.updatePassword(userId, hashedNewPassword);

      return { message: 'პაროლი წარმატებით შეიცვალა' };
    } catch (error) {
      console.error('Password change error:', error);
      throw error;
    }
  }
}
