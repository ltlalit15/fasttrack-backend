import { pool } from "../Config/dbConnect.js";

export const submitContactForm = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  try {
    const sql = `
      INSERT INTO contact_messages (name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [name, email, phone, subject, message]);

    res.status(200).json({ status: 'success', message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const getContactForm = async (req, res) => {
try {
    const sql = 'SELECT * FROM contact_messages';
    const [rows] = await pool.query(sql);

    res.status(200).json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const deleteContactForm = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM contact_messages WHERE id = ?", [id]);
    res.status(200).json({ message: "Contac-Us Form deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};




