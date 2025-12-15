// Fix passwords for all test users
const bcrypt = require('bcrypt');
const db = require('./config/db');

const SALT_ROUNDS = 10;

async function fixPasswords() {
  console.log('\n🔧 Fixing passwords for all test users...\n');

  const users = [
    { email: 'roger@net1io.com', password: 'user123' },
    { email: 'spaowner@net1io.com', password: 'spa123' },
    { email: 'azlan@net1io.com', password: 'admin123' }
  ];

  for (const user of users) {
    try {
      console.log(`Processing: ${user.email}`);
      console.log(`  Plain password: ${user.password}`);

      // Generate bcrypt hash
      const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
      console.log(`  Generated hash: ${hash.substring(0, 30)}...`);

      // Update database
      const result = await db.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email, name',
        [hash, user.email]
      );

      if (result.rows.length > 0) {
        console.log(`✅ Updated: ${result.rows[0].name} (${result.rows[0].email})\n`);
      } else {
        console.log(`❌ User not found: ${user.email}\n`);
      }

    } catch (error) {
      console.error(`❌ Error updating ${user.email}:`, error.message);
    }
  }

  console.log('='.repeat(60));
  console.log('\n✅ Password update complete!');
  console.log('\nVerifying passwords...\n');

  // Verify passwords work
  for (const user of users) {
    const result = await db.query(
      'SELECT password_hash FROM users WHERE email = $1',
      [user.email]
    );

    if (result.rows.length > 0) {
      const isValid = await bcrypt.compare(user.password, result.rows[0].password_hash);
      console.log(`${user.email} + ${user.password}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    }
  }

  console.log('\n✅ All passwords fixed and verified!\n');

  await db.pool.end();
}

fixPasswords().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
