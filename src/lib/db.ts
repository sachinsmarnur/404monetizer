import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
db.getConnection()
  .then(connection => {
    connection.release();
  })
  .catch(err => {
    // Connection errors are logged for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error connecting to the database:', err);
    }
  });

// Export both named and default export for backward compatibility
export default db; 