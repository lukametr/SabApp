import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

async function checkUsers() {
  console.log('🔍 Checking all users in database...');
  
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Get all users
    const users = await usersService.findAll();
    
    console.log(`\n📊 Total users found: ${users.length}\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User:`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   🔑 Role: ${user.role}`);
      console.log(`   📱 Status: ${user.status}`);
      console.log(`   🆔 ID: ${user._id}`);
      console.log(`   🔐 Has Password: ${user.password ? 'Yes' : 'No'}`);
      console.log(`   📞 Phone: ${user.phoneNumber}`);
      console.log(`   🆔 Personal Number: ${user.personalNumber}`);
      console.log('   ---');
    });
    
  } catch (error) {
    console.error('❌ Error checking users:', error.message);
  } finally {
    await app.close();
  }
}

// Run the script
checkUsers();
