import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import * as bcrypt from 'bcryptjs';

async function fixAdminPassword() {
  console.log('🔧 Fixing admin password...');
  
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
    console.log('🔐 Current Password (first 20 chars):', admin.password?.substring(0, 20) + '...');
    
    // Hash the password properly
    const plainPassword = 'admin123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    
    console.log('🔒 New hashed password (first 20 chars):', hashedPassword.substring(0, 20) + '...');
    
    // Update the password in database
    await usersService['userModel'].findByIdAndUpdate(
      admin._id,
      { password: hashedPassword },
      { new: true }
    );
    
    console.log('✅ Password updated successfully');
    
    // Test the new password
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('🧪 Password validation test:', isValid);
    
  } catch (error) {
    console.error('❌ Error fixing password:', error.message);
  } finally {
    await app.close();
  }
}

// Run the script
fixAdminPassword();
