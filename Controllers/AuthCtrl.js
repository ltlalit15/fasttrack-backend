import { pool } from "../Config/dbConnect.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../Config/jwt.js";
import multer from "multer";
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
import nodemailer from 'nodemailer';
import crypto from 'crypto';


import { sendEmail } from '../utils/sendEmail.js';
const upload = multer();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await pool.query("SELECT * FROM clients WHERE email = ?", [email]);
    if (results.length === 0) return res.status(401).json({ message: "Invalid email" });

    const user = results[0];
 
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Mark user as logged in
    

    const token = await generatetoken(user.id);
    return res.status(200).json(
      {
        message: "Login success",
        token, user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          phone: user.phone,
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: "Internal error", error: err.message });
  }
};

// SIGNUP
export const signUp = async (req, res) => {
  const { email, password, name, role, phone } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password, name, role, phone) VALUES (?, ?, ?, ?, ?)', [
      email,
      hashedPassword,
      name,
      role,
      phone,
    ]);

    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Error during signup', error });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 🔄 Await pool query
    const [result] = await pool.query("UPDATE users SET is_logged = false WHERE id = ?", [userId]);

    return res.status(200).json({ message: 'Logout successful' });

  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token', error: err.message });
  }
};

// GET ALL USERS 
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email, name, role, phone FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching users', error });
  }
};

// GET USER BY ID 
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [users] = await pool.query('SELECT id, email, name, role, phone FROM users WHERE id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ msg: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching user', error });
  }
};






export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM clients WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ status: 'fail', message: 'User not found with this email' });
    }

    const user = users[0];

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token to DB
    await pool.query(
      'UPDATE clients SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
      [hashedToken, tokenExpiry, user.id]
    );

    // Send reset link
    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password',
      resetToken: resetToken
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to email!',
      resetToken: resetToken // Only for debugging (remove in production)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error sending reset email' });
  }
};



export const resetPassword = async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ status: 'fail', message: 'All fields are required.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ status: 'fail', message: 'Passwords do not match.' });
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const [users] = await pool.query(
      'SELECT * FROM clients WHERE password_reset_token = ? AND password_reset_expires > ?',
      [hashedToken, new Date()]
    );

    if (users.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Token is invalid or has expired.' });
    }

    const user = users[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear token
    await pool.query(
      'UPDATE clients SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
      [hashedPassword, user.id]
    );

    res.status(200).json({
      status: 'success',
      message: 'Password reset successfully.'
    });

  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};





