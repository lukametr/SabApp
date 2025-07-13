import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/users/schemas/user.schema';

async function cleanupAndCreateAdmin() {
  console.log('🧹 Cleaning up database and creating super admin...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Delete all users
    console.log('�️ Deleting all users...');
    await usersService.deleteAllUsers();
    console.log('✅ All users deleted');
    
    // Create super admin
    console.log('👑 Creating super admin user...');
    
    const adminData = {
      name: 'Super Admin',
      email: 'admin@saba.com',
      password: 'admin123', // Will be hashed by createEmailUser
      personalNumber: '01234567891',
      phoneNumber: '555-0001',
      organization: 'SabaApp',
      position: 'System Administrator'
    };

    const newAdmin = await usersService.createEmailUser(adminData);
    
    // Update role to ADMIN after creation
    await usersService.updateUserRole(newAdmin.id, UserRole.ADMIN);
    
    console.log('✅ Super admin user created successfully!');
    console.log('📧 Email: admin@saba.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: ADMIN');
    console.log('🆔 ID:', newAdmin.id);
    
    // Verify final state
    const finalUsers = await usersService.findAll();
    console.log(`\n📊 Final user count: ${finalUsers.length}`);
    
    finalUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - Role: ${user.role} - Status: ${user.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
    console.error('Full error:', error);
  } finally {
    await app.close();
  }
}

// Run the script
cleanupAndCreateAdmin();
