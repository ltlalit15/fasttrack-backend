import { pool } from "../Config/dbConnect.js";

export const addStaffSolicitor = async (req, res) => {
  const { name, email, role, canView, canCreate, canEdit, canDelete } = req.body;
  try {
    await pool.query(
      `INSERT INTO clients 
       (name, email, role, canView, canCreate, canEdit, canDelete) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email, role, canView, canCreate, canEdit, canDelete]
    );
    res.status(201).json({ status: 'success', message: 'Staff/Solicitor added successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add Staff/Solicitor', error });
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
       SET name=?, email=?, role=?, canView=?, canCreate=?, canEdit=?, canDelete=? 
       WHERE id=?`,
      [name, email, role, canView, canCreate, canEdit, canDelete, id]
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

