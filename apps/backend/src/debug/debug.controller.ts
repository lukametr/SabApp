import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('debug')
export class DebugController {
  constructor(private usersService: UsersService) {}

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
}
