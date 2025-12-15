// Test all login credentials from login.md
const db = require('./config/db');

async function testAllLogins() {
  console.log('\n🔍 Testing All Login Credentials from login.md\n');
  console.log('='.repeat(60));

  const testAccounts = [
    { email: 'roger@net1io.com', password: 'user123', expectedRole: 'user', name: 'Roger (Test User)' },
    { email: 'spaowner@net1io.com', password: 'spa123', expectedRole: 'spa_owner', name: 'Spa Owner (Test)' },
    { email: 'azlan@net1io.com', password: 'admin123', expectedRole: 'admin', name: 'Azlan (Admin)' }
  ];

  let allPassed = true;

  for (const account of testAccounts) {
    console.log(`\n📧 Testing: ${account.email}`);
    console.log(`   Password: ${account.password}`);
    console.log(`   Expected Role: ${account.expectedRole}`);
    console.log('-'.repeat(60));

    try {
      // Check if user exists in database
      const result = await db.query(
        'SELECT id, email, name, password_hash, role, email_verified, is_active, phone FROM users WHERE email = $1',
        [account.email]
      );

      if (result.rows.length === 0) {
        console.log('❌ FAILED: User not found in database!');
        allPassed = false;
        continue;
      }

      const user = result.rows[0];

      // Verify account details
      console.log('✅ User found in database');
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone: ${user.phone || 'Not set'}`);
      console.log(`   Email Verified: ${user.email_verified}`);
      console.log(`   Active: ${user.is_active}`);
      console.log(`   Password Hash: ${user.password_hash.substring(0, 20)}...`);

      // Check role matches
      if (user.role !== account.expectedRole) {
        console.log(`❌ FAILED: Role mismatch! Expected ${account.expectedRole}, got ${user.role}`);
        allPassed = false;
        continue;
      }

      // Check name matches
      if (user.name !== account.name) {
        console.log(`⚠️  WARNING: Name mismatch! Expected "${account.name}", got "${user.name}"`);
      }

      // Check if account is active
      if (!user.is_active) {
        console.log('❌ FAILED: Account is not active!');
        allPassed = false;
        continue;
      }

      console.log('✅ ALL CHECKS PASSED for this account');

    } catch (error) {
      console.log(`❌ FAILED: Database error - ${error.message}`);
      allPassed = false;
    }
  }

  console.log('\n' + '='.repeat(60));

  if (allPassed) {
    console.log('\n✅ ALL ACCOUNTS VERIFIED IN DATABASE!\n');
    console.log('📝 Note: Password hashes are stored, not plain passwords.');
    console.log('   Actual password validation requires bcrypt comparison.');
    console.log('   Testing actual login endpoint next...\n');
  } else {
    console.log('\n❌ SOME ACCOUNTS FAILED VERIFICATION!\n');
    console.log('Please check the errors above and fix the issues.\n');
  }

  await db.pool.end();
  process.exit(allPassed ? 0 : 1);
}

testAllLogins();
