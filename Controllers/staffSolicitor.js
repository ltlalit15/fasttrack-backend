import { pool } from "../Config/dbConnect.js";

import bcrypt from "bcrypt";

export const addStaffSolicitor = async (req, res) => {
  console.log("📥 Incoming Request Body:", req.body); // Request data log

  const { name, email, password, role, canView, canCreate, canEdit, canDelete } = req.body;

  try {
    // Step 1: Password hashing
    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
    console.log("✅ Password hashed successfully");

    // Step 2: Prepare SQL query
    const query = `
      INSERT INTO clients 
      (name, email, password, role, canView, canCreate, canEdit, canDelete) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      name || null,
      email || null,
      hashedPassword || null,
      role || null,
      canView || null,
      canCreate || null,
      canEdit || null,
      canDelete || null
    ];

    console.log("📝 Query:", query);
    console.log("📦 Values:", values);

    // Step 3: Execute query
    const [result] = await pool.query(query, values);
    console.log("✅ Insert Success. MySQL Response:", result);

    // Step 4: Send success response
    res.status(201).json({
      status: 'success',
      message: 'Staff/Solicitor added successfully'
    });

  } catch (error) {
    console.error("❌ Error inserting into clients table:", error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add Staff/Solicitor',
      error: error.message || error
    });
  }
};


export const getAllStaffSolicitors = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM clients`);
    res.status(200).json({ status: 'success', message: 'Reterived All data',  data: rows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve Staff/Solicitors', error });
  }
};



export const getStaffSolicitorById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`SELECT * FROM clients WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ status: 'error', message: 'Staff/Solicitor not found' });
    }
    res.status(200).json({ status: 'success', message: 'Single data', data: rows[0] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to retrieve Staff/Solicitor', error });
  }
};



export const updateStaffSolicitor = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, canView, canCreate, canEdit, canDelete } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE clients 
       SET name=?, email=?, password = ?, role=?, canView=?, canCreate=?, canEdit=?, canDelete=? 
       WHERE id=?`,
      [name, email, password, role, canView, canCreate, canEdit, canDelete, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Staff/Solicitor not found' });
    }
    res.status(200).json({ status: 'success', message: 'Staff/Solicitor updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to update Staff/Solicitor', error });
  }
};



export const deleteStaffSolicitor = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query(`DELETE FROM clients WHERE id=?`, [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'error', message: 'Staff/Solicitor not found' });
    }
    res.status(200).json({ status: 'success', message: 'Staff/Solicitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to delete Staff/Solicitor', error });
  }
};

