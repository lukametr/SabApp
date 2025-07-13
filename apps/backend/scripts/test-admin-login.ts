import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';

async function testAdminLogin() {
  console.log('🔐 Testing admin login...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);

  try {
    // Test login with admin credentials
    const loginResult = await authService.loginWithEmail({
      email: 'admin@saba.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('🎟️ Access Token:', loginResult.accessToken ? 'Generated' : 'Not generated');
    console.log('👤 User Role:', loginResult.user.role);
    console.log('📧 User Email:', loginResult.user.email);
    console.log('🆔 User ID:', loginResult.user.id);
    
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await app.close();
  }
}

// Run the script
testAdminLogin();
