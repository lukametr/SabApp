import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/users/schemas/user.schema';

async function createAdminUser() {
  console.log('🔧 Creating admin user...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin already exists
    const existingAdmin = await usersService.findByEmail('lukametr@gmail.com');
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email: lukametr@gmail.com');
      return;
    }

    // Create admin user
    const adminData = {
      name: 'Luka Admin',
      email: 'lukametr@gmail.com',
      password: 'rikoriko', // Will be hashed by the service
      personalNumber: '01234567891', // Changed to unique number
      phoneNumber: '555-0002', // Changed to unique number
      organization: 'SabaApp',
      position: 'System Administrator'
    };

    const admin = await usersService.createEmailUser(adminData);
    
    // Update role to ADMIN after creation
    await usersService.updateUserRole(admin.id, UserRole.ADMIN);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: lukametr@gmail.com');
    console.log('🔑 Password: rikoriko');
    console.log('👑 Role: ADMIN');
    console.log('🆔 ID:', admin.id);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await app.close();
  }
}

// Run the script
createAdminUser();
