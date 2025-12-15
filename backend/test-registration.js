const { query } = require('./config/db');

async function testRegistration() {
  try {
    console.log('Checking users table...');
    const result = await query('SELECT id, email, name, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT 5');
    console.log('\nRecent users:');
    console.log(JSON.stringify(result.rows, null, 2));

    if (result.rows.length === 0) {
      console.log('\n⚠️  No users found in database');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testRegistration();
