// controllers/demoController.js
import { pool } from "../Config/dbConnect.js";

export const submitDemoRequest = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    company_size,
    subscribed_news
  } = req.body;

  if (!first_name || !last_name || !email || !phone || !company_size) {
    return res.status(400).json({
      success: false,
      message: "All fields are required except newsletter subscription."
    });
  }

  try {
    await pool.query(
      `INSERT INTO demo_requests (first_name, last_name, email, phone, company_size, subscribed_news)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, company_size, subscribed_news || false]
    );

    res.status(201).json({ success: true, message: "Demo request submitted successfully." });
  } catch (error) {
    console.error("❌ Demo submission error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getDemoRequest = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM demo_requests ");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clients", error: err.message });
  }
};


export const deleteDemoRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM demo_requests WHERE id = ?", [id]);
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

