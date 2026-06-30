import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    console.log('\n🔐 Testing Login Authentication\n');
    console.log('================================\n');

    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookshare',
      port: process.env.DB_PORT || 3306
    });

    // Test credentials
    const testEmail = 'likith@college.edu';
    const testPassword = 'password123';

    console.log('📧 Test Email:', testEmail);
    console.log('🔑 Test Password:', testPassword);
    console.log('\n');

    // Get user from database
    console.log('1️⃣ Fetching user from database...');
    const [users] = await pool.execute(
      'SELECT user_id, name, email, password_hash FROM users WHERE email = ?',
      [testEmail]
    );

    if (users.length === 0) {
      console.log('❌ User not found in database!');
      console.log('\n💡 Create user first or use a different email');
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ User found:', user.name);
    console.log('📝 User ID:', user.user_id);
    console.log('📧 Email:', user.email);
    console.log('🔒 Password hash:', user.password_hash.substring(0, 20) + '...');
    console.log('\n');

    // Test password comparison
    console.log('2️⃣ Testing password comparison...');
    const isMatch = await bcrypt.compare(testPassword, user.password_hash);
    
    if (isMatch) {
      console.log('✅ ✅ ✅ PASSWORD MATCHES! ✅ ✅ ✅');
      console.log('\n✨ Login should work with these credentials:');
      console.log('   Email:', testEmail);
      console.log('   Password:', testPassword);
      console.log('\n');
    } else {
      console.log('❌ ❌ ❌ PASSWORD DOES NOT MATCH! ❌ ❌ ❌');
      console.log('\n🔧 FIX: Run this command to set correct password:\n');
      
      const correctHash = await bcrypt.hash(testPassword, 10);
      console.log('   cd backend');
      console.log('   node -e "const bcrypt = require(\'bcryptjs\'); console.log(bcrypt.hashSync(\'password123\', 10));"');
      console.log('\n   Then update database:');
      console.log('   mysql -u root -p');
      console.log('   USE bookshare;');
      console.log(`   UPDATE users SET password_hash = '${correctHash}' WHERE email = '${testEmail}';`);
      console.log('   exit;\n');
    }

    // Generate new hash for reference
    console.log('3️⃣ Generating fresh hash for "password123"...');
    const newHash = await bcrypt.hash('password123', 10);
    console.log('🆕 New hash:', newHash);
    console.log('\n💡 Copy this hash and run:');
    console.log(`   UPDATE users SET password_hash = '${newHash}' WHERE email = '${testEmail}';\n`);

    await pool.end();

    if (isMatch) {
      console.log('🎉 AUTHENTICATION TEST PASSED! 🎉');
      process.exit(0);
    } else {
      console.log('❌ AUTHENTICATION TEST FAILED');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testLogin();
