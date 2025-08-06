// live mode
import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "switchyard.proxy.rlwy.net",   // ✅ Railway host
  port: 16378,                          // ✅ Railway port
  user: "root",                         // ✅ Railway username
  password: "JiIWGiXmyXtxNUKotWvRqmKCeIkSMTPS", // ✅ Railway password
  database: "railway",                 // ✅ Railway DB name
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
