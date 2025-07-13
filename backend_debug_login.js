/**
 * Backend-side fix for authentication issues
 * This should be deployed to production to add additional debug logging
 */

// Add this to auth.service.ts to catch more edge cases
async loginWithEmail(loginDto: any): Promise<AuthResponseDto> {
  try {
    console.log('🔐 Email Login - Starting:', loginDto.email);
    console.log('🔐 Email Login - Environment check:', {
      mongoUri: !!process.env.MONGODB_URI,
      jwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    });

    if (!loginDto.email || !loginDto.password) {
      console.error('🔐 Email Login - Missing credentials');
      throw new BadRequestException('Email and password are required');
    }

    // Find user by email
    console.log('🔐 Email Login - Looking up user by email:', loginDto.email);
    
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      console.log('🔐 Email Login - Database query result:', {
        userFound: !!user,
        userId: user?._id,
        userEmail: user?.email
      });
      
      if (!user) {
        console.error('🔐 Email Login - User not found:', loginDto.email);
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - User found:', { 
        id: user._id, 
        email: user.email, 
        hasPassword: !!user.password,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        passwordLength: user.password?.length || 0
      });

      // Verify password using bcrypt
      if (!user.password) {
        console.error('🔐 Email Login - User has no password hash');
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - About to compare passwords...', {
        inputPasswordLength: loginDto.password.length,
        storedHashLength: user.password.length,
        hashStartsWith: user.password.substring(0, 7) // Should be "$2b$10$" for bcrypt
      });

      const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
      console.log('🔐 Email Login - Password comparison result:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.error('🔐 Email Login - Password mismatch for user:', user.email);
        console.error('🔐 Email Login - Debug info:', {
          providedPassword: loginDto.password,
          storedHash: user.password.substring(0, 20) + '...',
          bcryptVersion: require('bcryptjs').version || 'unknown'
        });
        throw new UnauthorizedException('Invalid email or password');
      }

      console.log('🔐 Email Login - Password verified successfully');

      // Continue with rest of the login logic...
      
    } catch (dbError) {
      console.error('🔐 Email Login - Database error:', dbError);
      throw new Error('Database connection failed');
    }

  } catch (error) {
    console.error('🔐 Email Login - Caught error:', error);
    throw error;
  }
}
