import { pool } from "../Config/dbConnect.js";

export const addCaseType = async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query('INSERT INTO casetypes (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ status: 'success', message: 'Case type added successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to add case type', error });
  }
};

export const getAllCaseTypes = async (req, res) => {
  try {
    const [caseTypes] = await pool.query('SELECT * FROM casetypes ORDER BY id DESC');
    res.json({ status: 'success', data: caseTypes });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch case types', error });
  }
};
export const getcasebyclientid = async (req, res) => {
  const { client_id } = req.params;
  try {
    const [cases] = await pool.query(`
      SELECT 
        ct.id AS case_type_id,
        ct.name AS case_type_name
      FROM cases c
      LEFT JOIN casetypes ct ON c.case_type_id = ct.id
      WHERE c.client_id = ?
    `, [client_id]);

    res.json({ status: 'success', data: cases });
  } catch (error) {
    console.error("Error fetching client cases:", error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch client cases', error });
  }
};



export const updateCaseType = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE casetypes SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'fail', message: 'Case type not found' });
    }
    res.json({ status: 'success', message: 'Case type updated successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Update failed', error });
  }
};


export const deleteCaseType = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM casetypes WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ status: 'fail', message: 'Case type not found' });
    }
    res.json({ status: 'success', message: 'Case type deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Delete failed', error });
  }
};
