const mysql = require('mysql2');

// Create connection pool for better performance
const pool = mysql.createPool({
  host: 'localhost',
  user: 'platform',
  password: 'platform',
  database: 'crm_poc', // You can change this to your preferred database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get promise-based connection
const promisePool = pool.promise();

module.exports = promisePool;
