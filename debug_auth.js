// Debug script to test user authentication
// Run this in browser console to get more detailed info

console.log('🔍 Starting authentication debug...');

// Test with different credentials
const testCredentials = [
  { email: 'admin@example.com', password: 'admin123' },
  { email: 'user@example.com', password: 'user123' },
  { email: 'test@example.com', password: 'test123' },
];

async function testLogin(credentials) {
  console.log(`🧪 Testing login with: ${credentials.email}`);

  try {
    const response = await fetch('https://saba-app-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response headers:`, response.headers);

    const result = await response.json();
    console.log(`📊 Response body:`, result);

    if (response.ok) {
      console.log(`✅ Login successful for ${credentials.email}`);
      return result;
    } else {
      console.log(`❌ Login failed for ${credentials.email}: ${result.message}`);
      return null;
    }
  } catch (error) {
    console.error(`💥 Network error for ${credentials.email}:`, error);
    return null;
  }
}

// Test registration to create a user
async function testRegistration() {
  console.log('🧪 Testing user registration...');

  const newUser = {
    firstName: 'Debug',
    lastName: 'User',
    email: 'debug@test.com',
    password: 'debug123',
    personalNumber: '12345678901',
    phoneNumber: '+995555123456',
    organization: 'Test Org',
    position: 'Tester',
  };

  try {
    const response = await fetch('https://saba-app-production.up.railway.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    console.log(`📊 Registration response status: ${response.status}`);
    const result = await response.json();
    console.log(`📊 Registration response:`, result);

    if (response.ok) {
      console.log(`✅ Registration successful, now testing login...`);
      // Wait a bit then test login
      setTimeout(() => testLogin({ email: newUser.email, password: newUser.password }), 1000);
    }
  } catch (error) {
    console.error(`💥 Registration error:`, error);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Running authentication tests...');

  // Try existing users first
  for (const creds of testCredentials) {
    await testLogin(creds);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms between tests
  }

  // Then try creating and testing a new user
  await testRegistration();
}

// Check localStorage state
console.log('🗃️ Current localStorage state:');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Clear localStorage for clean test
localStorage.clear();
console.log('🧹 Cleared localStorage');

// Run the tests
runTests();
