import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '../utils/email';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from '../users/dto/auth-response.dto';

@Injectable()
export class AuthService {
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
    console.log(
      '🔐 Auth Service - JWT secret configured:',
      !!this.configService.get<string>('JWT_SECRET'),
    );
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
        // Support both organization and company (fallback if company is used on client)
        organization: registerDto.organization ?? registerDto.company,
        position: registerDto.position,
        emailVerificationToken,
        emailVerificationTokenExpires,
      });

      // If phone is provided in DTO under different naming, persist it
      try {
        const phone = registerDto.phoneNumber ?? registerDto.phone;
        if (phone) {
          await this.usersService.updateProfile(String(user._id), {
            phoneNumber: phone,
          } as any);
        }
      } catch (e) {
        console.error('☎️ Failed to persist phone number after registration (non-fatal):', (e as any)?.message || e);
      }

      console.log('≡ƒöº Email Registration - Success:', user.email);
      // Send verification email (do not fail registration if email fails)
      let emailSent = true;
      try {
        await sendVerificationEmail(user.email, emailVerificationToken);
      } catch (e) {
        emailSent = false;
        console.error(
          '📧 Email sending failed during registration (continuing):',
          (e as any)?.message || e,
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
        status: user.status,
        lastLoginAt: user.lastLoginAt,
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

      // Check if user has a password
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
