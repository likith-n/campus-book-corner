import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabase() {
  try {
    console.log('🔌 Connecting to database...');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Database:', process.env.DB_NAME);
    console.log('Port:', process.env.DB_PORT);
    
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bookshare',
      port: process.env.DB_PORT || 3306
    });

    // Test connection
    console.log('\n🔍 Testing connection...');
    const connection = await pool.getConnection();
    console.log('✅ Connection successful!');
    connection.release();

    // Test simple queries
    console.log('\n📊 Testing simple queries...');
    const [users] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users count:', users[0].count);

    const [books] = await pool.execute('SELECT COUNT(*) as count FROM books');
    console.log('✅ Books count:', books[0].count);

    const [listings] = await pool.execute('SELECT COUNT(*) as count FROM listings');
    console.log('✅ Listings count:', listings[0].count);

    // Test JOIN query
    console.log('\n🔗 Testing JOIN query...');
    const [result] = await pool.execute(`
      SELECT 
        l.listing_id,
        l.price,
        l.condition_type,
        b.title,
        b.author,
        u.name as owner_name
      FROM listings l
      JOIN books b ON l.book_id = b.book_id
      JOIN users u ON l.user_id = u.user_id
      LIMIT 2
    `);
    console.log('✅ JOIN query returned', result.length, 'results');
    console.log('Sample result:', JSON.stringify(result[0], null, 2));

    console.log('\n✅✅✅ ALL TESTS PASSED! ✅✅✅');
    console.log('\nYour database is working correctly!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌❌❌ ERROR DETECTED ❌❌❌');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('\nFull error details:');
    console.error(error);
    process.exit(1);
  }
}

testDatabase();
