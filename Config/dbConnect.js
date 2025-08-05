

import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "localhost",     // 👈 Localhost for local MySQL
  port: 3306,            // 👈 Default MySQL port
  user: "root",          // 👈 Your local MySQL username
  password: "",          // 👈 Or your local MySQL password
  database: "fasttrack",                // Database Name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
});
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" Local MySQL database connected !!" );
    connection.release();
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
})();