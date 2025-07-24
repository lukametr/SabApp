import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MigrationService } from './migration.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('debug')
export class DebugController {
  constructor(
    private usersService: UsersService,
    private migrationService: MigrationService,
    @InjectConnection() private connection: Connection,
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('db-connection')
  async testDbConnection() {
    try {
      // Simple database connection test
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        message: 'Database connection working',
        userCount: users.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('users')
  async listUsers() {
    try {
      const users = await this.usersService.findAll();
      return {
        status: 'success',
        userCount: users.length,
        users: users.map(user => ({
          id: user._id,
          email: user.email,
          name: user.name,
          googleId: user.googleId,
          authProvider: user.authProvider,
          createdAt: user.createdAt
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('fix-null-googleid')
  async fixNullGoogleId() {
    return this.migrationService.fixNullGoogleId();
  }

  @Get('env')
  async testEnvironment() {
    return {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    };
  }

  @Post('fix-indexes')
  async fixIndexes() {
    try {
      console.log('🔧 Starting index fix...');
      
      const db = this.connection.db;
      if (!db) {
        throw new Error('Database connection not available');
      }
      
      const collection = db.collection('users');
      
      // Get current indexes
      const indexes = await collection.indexes();
      console.log('📋 Current indexes:', JSON.stringify(indexes, null, 2));
      
      // Check if googleId_1 index exists and drop it
      const googleIdIndex = indexes.find(idx => idx.name === 'googleId_1');
      if (googleIdIndex) {
        console.log('🗑️ Dropping old googleId_1 index...');
        await collection.dropIndex('googleId_1');
        console.log('✅ Old googleId_1 index dropped');
      }
      
      // Recreate the googleId index as sparse
      console.log('🔨 Creating new sparse googleId index...');
      await collection.createIndex({ googleId: 1 }, { unique: true, sparse: true });
      console.log('✅ New sparse googleId index created');
      
      // Also ensure other indexes are sparse if needed
      const personalNumberIndex = indexes.find(idx => idx.name === 'personalNumber_1');
      if (personalNumberIndex && !personalNumberIndex.sparse) {
        console.log('🗑️ Dropping old personalNumber_1 index...');
        await collection.dropIndex('personalNumber_1');
        console.log('🔨 Creating new sparse personalNumber index...');
        await collection.createIndex({ personalNumber: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse personalNumber index created');
      }
      
      const phoneNumberIndex = indexes.find(idx => idx.name === 'phoneNumber_1');
      if (phoneNumberIndex && !phoneNumberIndex.sparse) {
        console.log('🗑️ Dropping old phoneNumber_1 index...');
        await collection.dropIndex('phoneNumber_1');
        console.log('🔨 Creating new sparse phoneNumber index...');
        await collection.createIndex({ phoneNumber: 1 }, { unique: true, sparse: true });
        console.log('✅ New sparse phoneNumber index created');
      }
      
      // Get final indexes
      const finalIndexes = await collection.indexes();
      
      return {
        status: 'success',
        message: 'Indexes fixed successfully',
        beforeIndexes: indexes.length,
        afterIndexes: finalIndexes.length,
        finalIndexes: finalIndexes.map(idx => ({
          name: idx.name,
          key: idx.key,
          unique: idx.unique,
          sparse: idx.sparse
        })),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Error fixing indexes:', error);
      return {
        status: 'error',
        message: 'Failed to fix indexes',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('oauth-config')
  async getOAuthConfig() {
    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      config: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...` : 'NOT_SET',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
        FRONTEND_URL: process.env.FRONTEND_URL || 'NOT_SET',
        CORS_ORIGIN: process.env.CORS_ORIGIN || 'NOT_SET',
        NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
        googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0
      }
    };
  }

  @Get('oauth-test')
  async testOAuthFlow() {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';
    const frontendUrl = process.env.FRONTEND_URL || 'https://sabapp.com';
    
    const redirectUri = `${backendUrl}/auth/google/callback`;
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `prompt=consent`;
    
    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      oauthFlow: {
        step1_frontend_to_backend: '/api/auth/google',
        step2_backend_redirects_to: googleAuthUrl,
        step3_google_callback_to: redirectUri,
        step4_backend_redirects_to: `${frontendUrl}/?auth=success&token=JWT_TOKEN&user=USER_DATA`,
      },
      configuration: {
        backendUrl,
        frontendUrl,
        redirectUri,
        googleClientId: googleClientId ? `${googleClientId.substring(0, 20)}...` : 'NOT_SET',
        googleClientSecretSet: !!googleClientSecret,
      },
      debug: {
        encodedRedirectUri: encodeURIComponent(redirectUri),
        googleAuthUrlLength: googleAuthUrl.length,
      }
    };
  }

  @Post('oauth-token-exchange-test')
  async testTokenExchange(@Body() body: { code?: string } = {}) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';
    const redirectUri = `${backendUrl}/auth/google/callback`;
    
    return {
      status: 'simulation',
      timestamp: new Date().toISOString(),
      providedCode: body.code || 'NO_CODE_PROVIDED',
      tokenExchangeParams: {
        grant_type: 'authorization_code',
        code: body.code || 'AUTHORIZATION_CODE_FROM_GOOGLE',
        redirect_uri: redirectUri,
        client_id: clientId ? `${clientId.substring(0, 20)}...` : 'NOT_SET',
        client_secret: clientSecret ? 'SET' : 'NOT_SET',
      },
      googleTokenEndpoint: 'https://oauth2.googleapis.com/token',
      expectedResponse: {
        access_token: 'ACCESS_TOKEN',
        refresh_token: 'REFRESH_TOKEN',
        id_token: 'ID_TOKEN',
        token_type: 'Bearer',
        expires_in: 3600
      },
      possibleErrors: [
        'invalid_grant - თუ authorization code არასწორია ან გამოყენებულია',
        'redirect_uri_mismatch - თუ redirect_uri არ ემთხვევა Google Console-ში დარეგისტრირებულს',
        'invalid_client - თუ client_id ან client_secret არასწორია'
      ]
    };
  }

  @Get('oauth-detailed-check')
  async detailedOAuthCheck() {
    // Get all OAuth related configs
    const configs = {
      env: {
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      },
      configService: {
        GOOGLE_CLIENT_ID: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        FRONTEND_URL: this.configService.get<string>('FRONTEND_URL'),
      }
    };

    // Build URLs
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';
    const frontendUrl = process.env.FRONTEND_URL || 'https://sabapp.com';
    const redirectUri = `${backendUrl}/auth/google/callback`;

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      urls: {
        backend: backendUrl,
        frontend: frontendUrl,
        redirectUri: redirectUri,
        googleConsoleRedirectUri: 'Should be: ' + redirectUri,
      },
      configComparison: {
        clientId: {
          fromEnv: configs.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
          fromConfigService: configs.configService.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
          match: configs.env.GOOGLE_CLIENT_ID === configs.configService.GOOGLE_CLIENT_ID
        },
        clientSecret: {
          fromEnv: configs.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
          fromConfigService: configs.configService.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
          match: configs.env.GOOGLE_CLIENT_SECRET === configs.configService.GOOGLE_CLIENT_SECRET
        },
        frontendUrl: {
          fromEnv: configs.env.FRONTEND_URL,
          fromConfigService: configs.configService.FRONTEND_URL,
          match: configs.env.FRONTEND_URL === configs.configService.FRONTEND_URL
        }
      },
      authServiceCheck: {
        hasAuthService: !!this.authService,
        hasConfigService: !!this.configService,
      }
    };
  }

  @Post('oauth-real-test')
  async realOAuthTest(@Body() body: { code: string }) {
    console.log('🧪 Debug: Real OAuth test initiated with code:', !!body.code);
    
    if (!body.code) {
      return {
        status: 'error',
        message: 'Authorization code required',
        timestamp: new Date().toISOString()
      };
    }

    try {
      // Call the real OAuth handler
      const result = await this.authService.handleGoogleCallback(body.code, 'debug');
      
      return {
        status: 'success',
        message: 'OAuth token exchange successful',
        result: {
          hasAccessToken: !!result.accessToken,
          hasUser: !!result.user,
          userEmail: result.user?.email,
          userId: result.user?.id
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🧪 Debug: OAuth test failed:', error);
      
      return {
        status: 'error',
        message: 'OAuth token exchange failed',
        error: {
          message: error.message,
          code: error.code,
          name: error.name,
          details: error.response || null
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  @Get('oauth-manual-auth-url')
  async getManualAuthUrl() {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://sabapp.com/api';
    const redirectUri = `${backendUrl}/auth/google/callback`;
    
    // Create state parameter for tracking
    const state = Math.random().toString(36).substring(2, 15);
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=email profile&` +
      `access_type=offline&` +
      `prompt=consent&` +
      `state=${state}`;
    
    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      message: 'მანუალური OAuth URL დაგენერირდა. ბრაუზერში გახსენით და ავტორიზაციის კოდი მიიღეთ.',
      authUrl: googleAuthUrl,
      instructions: [
        '1. გადახვიდეთ authUrl ლინკზე',
        '2. Google-ში შედით და ნებართვა მიეცით',
        '3. შედეგად მიღებული authorization code გამოიყენეთ POST /debug/oauth-real-test endpoint-ში'
      ],
      state: state,
      debugInfo: {
        redirectUri,
        clientId: googleClientId ? `${googleClientId.substring(0, 20)}...` : 'NOT_SET'
      }
    };
  }

  @Get('oauth-callback-debug')
  async oauthCallbackDebug(@Query() query: any) {
    console.log('🧪 Debug: OAuth callback received with query params:', query);
    
    const { code, state, error } = query;
    
    if (error) {
      return {
        status: 'error',
        message: 'OAuth authorization failed',
        error: error,
        timestamp: new Date().toISOString()
      };
    }
    
    if (!code) {
      return {
        status: 'error',
        message: 'No authorization code received',
        query: query,
        timestamp: new Date().toISOString()
      };
    }
    
    try {
      // Test real OAuth flow
      const result = await this.authService.handleGoogleCallback(code, state);
      
      return {
        status: 'success',
        message: 'OAuth callback successful!',
        result: {
          hasAccessToken: !!result.accessToken,
          hasUser: !!result.user,
          userEmail: result.user?.email,
          userId: result.user?.id,
          accessTokenLength: result.accessToken?.length || 0
        },
        debugInfo: {
          codeLength: code.length,
          state: state,
          query: query
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('🧪 Debug: OAuth callback failed:', error);
      
      return {
        status: 'error',
        message: 'OAuth callback failed',
        error: {
          message: error.message,
          code: error.code,
          name: error.name,
          details: error.response || null
        },
        debugInfo: {
          codeLength: code.length,
          state: state,
          query: query
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  @Post('oauth-direct-token-test')
  async directTokenTest(@Body() body: { code: string }) {
    if (!body.code) {
      return {
        status: 'error',
        message: 'Authorization code required',
        timestamp: new Date().toISOString()
      };
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') || '';
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET') || '';
    const backendUrl = this.configService.get<string>('NEXT_PUBLIC_API_URL') || 'https://sabapp.com/api';
    const redirectUri = `${backendUrl}/auth/google/callback`;

    console.log('🧪 Direct Token Test Debug:', {
      hasClientId: !!clientId,
      clientIdLength: clientId.length,
      hasClientSecret: !!clientSecret,
      clientSecretLength: clientSecret.length,
      redirectUri,
      codeLength: body.code.length,
      backendUrl
    });

    try {
      // Direct Google token exchange (same as auth.service.ts)
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: body.code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        } as Record<string, string>),
      });

      console.log('🧪 Google Token Response Status:', tokenResponse.status);
      console.log('🧪 Google Token Response Headers:', Object.fromEntries(tokenResponse.headers.entries()));
      
      const responseText = await tokenResponse.text();
      console.log('🧪 Google Token Response Body:', responseText);
      
      let responseJson;
      try {
        responseJson = JSON.parse(responseText);
      } catch (parseError) {
        responseJson = { raw: responseText };
      }

      return {
        status: tokenResponse.ok ? 'success' : 'error',
        timestamp: new Date().toISOString(),
        googleResponse: {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          headers: Object.fromEntries(tokenResponse.headers.entries()),
          body: responseJson
        },
        requestParams: {
          grant_type: 'authorization_code',
          code: `${body.code.substring(0, 20)}...`,
          redirect_uri: redirectUri,
          client_id: `${clientId.substring(0, 20)}...`,
          client_secret: clientSecret ? 'SET' : 'NOT_SET',
          endpoint: 'https://oauth2.googleapis.com/token'
        },
        analysis: {
          tokenExchangeSuccessful: tokenResponse.ok,
          hasAccessToken: responseJson?.access_token ? true : false,
          hasIdToken: responseJson?.id_token ? true : false,
          errorType: responseJson?.error || null,
          errorDescription: responseJson?.error_description || null
        }
      };
    } catch (fetchError) {
      console.error('🧪 Fetch Error:', fetchError);
      
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: {
          message: fetchError.message,
          type: 'FETCH_ERROR',
          details: fetchError
        }
      };
    }
  }

  @Post('fix-auth-provider')
  async fixAuthProvider(@Body() body: { email: string, authProvider: string }) {
    try {
      const { email, authProvider } = body;
      
      if (!email || !authProvider) {
        return {
          status: 'error',
          message: 'Email and authProvider are required'
        };
      }

      const user = await this.usersService.findByEmail(email);
      if (!user) {
        return {
          status: 'error',
          message: 'User not found'
        };
      }

      // Update authProvider manually
      await this.connection.collection('users').updateOne(
        { email: email },
        { $set: { authProvider: authProvider } }
      );

      const updatedUser = await this.usersService.findByEmail(email);
      
      if (!updatedUser) {
        return {
          status: 'error',
          message: 'Failed to retrieve updated user'
        };
      }

      return {
        status: 'success',
        message: 'AuthProvider updated successfully',
        user: {
          email: updatedUser.email,
          authProvider: updatedUser.authProvider,
          googleId: !!updatedUser.googleId
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Failed to update authProvider',
        error: error.message
      };
    }
  }

  // Google OAuth specific debug endpoints
  @Get('search-user/:email')
  async searchUserByEmail(@Param('email') email: string) {
    try {
      // Validate and clean the email input
      const cleanEmail = email?.trim()?.toLowerCase();
      if (!cleanEmail) {
        return {
          status: 'error',
          message: 'Email parameter is required'
        };
      }

      console.log('🔍 Debug: Searching for user with email:', cleanEmail);

      // Search by email using UsersService
      const userByEmail = await this.usersService.findByEmail(cleanEmail);
      console.log('🔍 Debug: User found by email:', !!userByEmail);

      // Also try to find by googleId if the email looks like it might be from Google
      let userByGoogleId = null;
      try {
        userByGoogleId = await this.usersService.findByGoogleId(cleanEmail);
        console.log('🔍 Debug: User found by googleId:', !!userByGoogleId);
      } catch (error) {
        console.log('🔍 Debug: GoogleId search failed (expected if not a Google user):', error.message);
      }

      return {
        status: 'success',
        searchEmail: cleanEmail,
        results: {
          byEmail: userByEmail ? {
            id: userByEmail._id,
            email: userByEmail.email,
            name: userByEmail.name,
            authProvider: userByEmail.authProvider,
            googleId: !!userByEmail.googleId,
            createdAt: userByEmail.createdAt,
            status: userByEmail.status
          } : null,
          byGoogleId: userByGoogleId ? {
            id: userByGoogleId._id,
            email: userByGoogleId.email,
            name: userByGoogleId.name,
            authProvider: userByGoogleId.authProvider,
            googleId: !!userByGoogleId.googleId,
            createdAt: userByGoogleId.createdAt,
            status: userByGoogleId.status
          } : null
        }
      };
    } catch (error) {
      console.error('🔍 Debug: Search user error:', error);
      return {
        status: 'error',
        message: 'Failed to search for user',
        error: error.message
      };
    }
  }

  @Post('test-google-login')
  async testGoogleLogin(@Body() googleData: any) {
    try {
      console.log('🧪 Debug: Testing Google login with data:', {
        email: googleData.email,
        hasGoogleId: !!googleData.googleId,
        hasName: !!googleData.name
      });

      // Validate required fields
      if (!googleData.email || !googleData.googleId) {
        return {
          status: 'error',
          message: 'Email and googleId are required for Google login test'
        };
      }

      // Step 1: Try to find existing user
      const existingUser = await this.usersService.findByGoogleId(googleData.googleId);
      console.log('🧪 Debug: Existing user found:', !!existingUser);

      if (existingUser) {
        // User exists, simulate login
        return {
          status: 'success',
          action: 'login',
          message: 'User found - would proceed with login',
          user: {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
            authProvider: existingUser.authProvider,
            googleId: !!existingUser.googleId,
            status: existingUser.status
          }
        };
      } else {
        // User doesn't exist, simulate registration
        console.log('🧪 Debug: User not found, would create new user');
        
        // Check if email already exists with different provider
        const emailUser = await this.usersService.findByEmail(googleData.email);
        if (emailUser) {
          return {
            status: 'conflict',
            action: 'email_exists',
            message: 'Email already exists with different authentication provider',
            existingUser: {
              id: emailUser._id,
              email: emailUser.email,
              authProvider: emailUser.authProvider,
              googleId: !!emailUser.googleId
            }
          };
        }

        return {
          status: 'success',
          action: 'register',
          message: 'New user - would proceed with registration',
          userData: {
            email: googleData.email,
            name: googleData.name,
            googleId: googleData.googleId,
            authProvider: 'google'
          }
        };
      }
    } catch (error) {
      console.error('🧪 Debug: Test Google login error:', error);
      return {
        status: 'error',
        message: 'Failed to test Google login',
        error: error.message
      };
    }
  }

  @Get('verify-google-user/:googleId')
  async verifyGoogleUser(@Param('googleId') googleId: string) {
    try {
      const cleanGoogleId = googleId?.trim();
      if (!cleanGoogleId) {
        return {
          status: 'error',
          message: 'GoogleId parameter is required'
        };
      }

      console.log('✅ Debug: Verifying Google user with ID:', cleanGoogleId);

      const user = await this.usersService.findByGoogleId(cleanGoogleId);
      
      return {
        status: 'success',
        googleId: cleanGoogleId,
        userExists: !!user,
        user: user ? {
          id: user._id,
          email: user.email,
          name: user.name,
          authProvider: user.authProvider,
          googleId: !!user.googleId,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        } : null
      };
    } catch (error) {
      console.error('✅ Debug: Verify Google user error:', error);
      return {
        status: 'error',
        message: 'Failed to verify Google user',
        error: error.message
      };
    }
  }

  @Post('make-user-admin')
  async makeUserAdmin(@Body() body: { userId?: string, email?: string, googleId?: string }) {
    try {
      const { userId, email, googleId } = body;
      
      if (!userId && !email && !googleId) {
        return {
          status: 'error',
          message: 'userId, email, or googleId is required'
        };
      }

      let user = null;
      
      if (userId) {
        user = await this.usersService.findById(userId);
      } else if (email) {
        user = await this.usersService.findByEmail(email);
      } else if (googleId) {
        user = await this.usersService.findByGoogleId(googleId);
      }

      if (!user) {
        return {
          status: 'error',
          message: 'User not found'
        };
      }

      console.log('🔧 Making user admin:', user.email);
      
      // Update role to ADMIN
      const updatedUser = await this.usersService.updateUserRole(String(user._id), 'admin' as any);
      
      return {
        status: 'success',
        message: 'User role updated to ADMIN successfully',
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          authProvider: updatedUser.authProvider
        }
      };
    } catch (error) {
      console.error('❌ Error making user admin:', error);
      return {
        status: 'error',
        message: 'Failed to update user role',
        error: error.message
      };
    }
  }
}

