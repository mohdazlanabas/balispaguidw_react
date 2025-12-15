// Test actual login API endpoint
const API_BASE = 'http://localhost:4000';

async function testLogin(email, password, expectedRole) {
  console.log(`\n📧 Testing: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Expected Role: ${expectedRole}`);
  console.log('-'.repeat(60));

  try {
    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log(`   Token: ${data.token.substring(0, 30)}...`);
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Name: ${data.user.name}`);
      console.log(`   Email: ${data.user.email}`);
      console.log(`   Role: ${data.user.role}`);
      console.log(`   Phone: ${data.user.phone || 'Not set'}`);

      if (data.user.role === expectedRole) {
        console.log(`✅ Role matches expected: ${expectedRole}`);
      } else {
        console.log(`❌ Role mismatch! Expected ${expectedRole}, got ${data.user.role}`);
        return false;
      }

      return true;
    } else {
      console.log(`❌ LOGIN FAILED!`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${data.message}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('\n🔐 Testing Login API Endpoint');
  console.log('='.repeat(60));

  const tests = [
    { email: 'roger@net1io.com', password: 'user123', role: 'user' },
    { email: 'spaowner@net1io.com', password: 'spa123', role: 'spa_owner' },
    { email: 'azlan@net1io.com', password: 'admin123', role: 'admin' }
  ];

  let allPassed = true;

  for (const test of tests) {
    const passed = await testLogin(test.email, test.password, test.role);
    if (!passed) allPassed = false;
  }

  console.log('\n' + '='.repeat(60));

  if (allPassed) {
    console.log('\n✅ ALL LOGIN TESTS PASSED!\n');
    console.log('All credentials from login.md are working correctly.');
    console.log('Users can now login and will be redirected based on role:\n');
    console.log('  - roger@net1io.com → /account (MyAccount Page)');
    console.log('  - spaowner@net1io.com → /spa-owner (Spa Owner Dashboard)');
    console.log('  - azlan@net1io.com → /admin (Admin page - TBD)\n');
  } else {
    console.log('\n❌ SOME TESTS FAILED!\n');
  }

  process.exit(allPassed ? 0 : 1);
}

runTests();
