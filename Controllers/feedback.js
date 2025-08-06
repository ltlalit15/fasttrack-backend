
import { pool } from "../Config/dbConnect.js";
export const submitFeedback = async (req, res) => {
  const { client_id, rating, comment } = req.body;

  if (!client_id || !rating) {
    return res.status(400).json({ success: false, message: "Client ID and rating are required." });
  }

  try {
    await pool.query(
      "INSERT INTO feedbacks (client_id, rating, comment) VALUES (?, ?, ?)",
      [client_id, rating, comment || null]
    );

    res.status(201).json({ success: true, message: "Feedback submitted successfully." });
  } catch (error) {
    console.error("❌ Feedback submission error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getFeedback = async (req, res) => {
    try {
        const [results] = await pool.query("SELECT * FROM feedbacks ORDER BY submitted_at DESC");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error fetching feedback:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deletefeedback = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM feedbacks WHERE id = ?", [id]);
    res.status(200).json({ message: "Documents deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};






