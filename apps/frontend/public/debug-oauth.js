// Debug Google OAuth
window.debugGoogleOAuth = async () => {
  console.log('🔧 Starting Google OAuth Debug...');

  // Test 1: Check environment variables
  console.log('1️⃣ Environment Check:');
  console.log('  - API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log(
    '  - Google Client ID:',
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 30) + '...'
  );

  // Test 2: Test backend health
  console.log('2️⃣ Backend Health Check:');
  try {
    const healthResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/debug`);
    console.log('  ✅ Backend status:', healthResponse.status);
    const healthData = await healthResponse.json();
    console.log('  📊 Backend data:', healthData);
  } catch (error) {
    console.error('  ❌ Backend error:', error);
  }

  // Test 3: Test Google OAuth URL generation
  console.log('3️⃣ OAuth URL Test:');
  try {
    const oauthResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
      method: 'GET',
      redirect: 'manual',
    });
    console.log('  📡 OAuth response status:', oauthResponse.status);
    console.log('  📡 OAuth response type:', oauthResponse.type);

    if (oauthResponse.status === 302) {
      const location = oauthResponse.headers.get('Location');
      console.log('  🔗 Redirect URL:', location?.substring(0, 100) + '...');

      // Test if we can open the URL
      if (confirm('გსურთ Google OAuth URL-ის გახსნა?')) {
        window.location.href = location || '';
      }
    }
  } catch (error) {
    console.error('  ❌ OAuth error:', error);
  }

  console.log('🔧 Debug completed! Check console for details.');
};

console.log('🚀 Debug function loaded! Run window.debugGoogleOAuth() to test.');
