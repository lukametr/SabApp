import { Controller, Get, Post, Body } from '@nestjs/common';
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
    const frontendUrl = process.env.FRONTEND_URL || 'https://saba-app-production.up.railway.app';
    
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
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
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://saba-app-production.up.railway.app/api';
    const frontendUrl = process.env.FRONTEND_URL || 'https://saba-app-production.up.railway.app';
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
}
