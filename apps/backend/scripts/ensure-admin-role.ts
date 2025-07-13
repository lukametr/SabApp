import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { UserRole } from '../src/users/schemas/user.schema';

async function ensureAdminRole() {
  console.log('🔧 Ensuring admin has correct role...');
  
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
    console.log('👤 Name:', admin.name);
    console.log('🔑 Current Role:', admin.role);
    console.log('📱 Status:', admin.status);
    
    if (admin.role !== UserRole.ADMIN) {
      console.log('🔧 Updating role to ADMIN...');
      await usersService.updateUserRole(String(admin._id), UserRole.ADMIN);
      console.log('✅ Role updated to ADMIN');
    } else {
      console.log('✅ Role is already ADMIN');
    }
    
    // Verify the update
    const updatedAdmin = await usersService.findByEmail('admin@saba.com');
    console.log('🔍 Final verification:');
    console.log('  - Role:', updatedAdmin?.role);
    console.log('  - Should be:', UserRole.ADMIN);
    console.log('  - Match:', updatedAdmin?.role === UserRole.ADMIN);
    
  } catch (error) {
    console.error('❌ Error ensuring admin role:', error.message);
  } finally {
    await app.close();
  }
}

// Run the script
ensureAdminRole();
