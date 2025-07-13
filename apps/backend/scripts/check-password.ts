import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import * as bcrypt from 'bcryptjs';

async function checkPassword() {
  console.log('🔍 Checking admin password...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Get admin user
    const admin = await usersService.findByEmail('admin@saba.com');
    
    if (!admin) {
      console.log('❌ Admin not found');
      return;
    }
    
    console.log('📧 Email:', admin.email);
    console.log('🔐 Has Password:', admin.password ? 'Yes' : 'No');
    console.log('🔐 Password (first 20 chars):', admin.password?.substring(0, 20) + '...');
    
    // Test password comparison
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, admin.password || '');
    console.log(`🧪 Password "${testPassword}" is valid:`, isValid);
    
    // Test with different variations
    const variations = ['admin123', 'Admin123', 'ADMIN123', 'admin', 'password'];
    
    for (const variation of variations) {
      const isValidVariation = await bcrypt.compare(variation, admin.password || '');
      console.log(`🧪 Password "${variation}" is valid:`, isValidVariation);
    }
    
  } catch (error) {
    console.error('❌ Error checking password:', error.message);
  } finally {
    await app.close();
  }
}

// Run the script
checkPassword();
