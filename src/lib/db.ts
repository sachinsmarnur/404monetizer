import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 50,        // Increased from 10 to handle more concurrent users
  queueLimit: 0,             // Unlimited queue
});

// Enhanced connection testing with retry logic
const testConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await db.getConnection();
      await connection.ping();
      connection.release();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Database connected successfully');
      }
      return;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ Database connection attempt ${i + 1} failed:`, err);
      }
      
      if (i === retries - 1) {
        if (process.env.NODE_ENV === 'development') {
          console.error('💥 All database connection attempts failed');
        }
        throw err;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Test connection on startup
testConnection().catch(err => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Fatal: Could not establish database connection:', err);
  }
});

// Handle pool events for monitoring
db.on('connection', (connection) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('New database connection established as id ' + connection.threadId);
  }
});

// Export both named and default export for backward compatibility
export default db; 