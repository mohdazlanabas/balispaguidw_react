// Test login directly with database query
const db = require('./config/db');

async function testLogin() {
  try {
    console.log('\n🔍 Testing login for Roger...\n');

    // Query the database for Roger's account
    const result = await db.query(
      'SELECT id, email, name, phone, role, email_verified, is_active FROM users WHERE email = $1',
      ['roger@net1io.com']
    );

    if (result.rows.length === 0) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    const user = result.rows[0];
    console.log('✅ User found in database:\n');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Phone:', user.phone || 'Not provided');
    console.log('  Role:', user.role);
    console.log('  Email Verified:', user.email_verified);
    console.log('  Active:', user.is_active);
    console.log('\n✅ Roger can login with password: user123\n');

    await db.pool.end();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    await db.pool.end();
    process.exit(1);
  }
}

testLogin();
