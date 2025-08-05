// live mode
import { JSONCookie } from 'cookie-parser';
import { query } from 'express';
import mysql from 'mysql2/promise';
export const pool = mysql.createPool({
  host: "caboose.proxy.rlwy.net",     // 👉 Railway DB Host
  port: 29120,                         // 👉 Railway Port
  user: "root",                        // 👉 Username
  password: "iKRaPAybhvSkhqWlkRYzRoEMEbZaSgDj", // 👉 Password
  database: "railway",                // 👉 Database name
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
