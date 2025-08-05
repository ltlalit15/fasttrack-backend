import { pool } from "../Config/dbConnect.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../Config/jwt.js";
import multer from "multer";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
const upload = multer();

export const createInquiry = async (req, res) => {
  const { name, contact_method, source, type, initial_notes, status } = req.body;
  try {
    await pool.query(
      "INSERT INTO inquiries (name, contact_method, source, type, initial_notes, status) VALUES (?, ?, ?, ?, ?, ?)",
      [name, contact_method, source, type, initial_notes, status || 'New']
    );
    res.status(201).json({ message: "Inquiry created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

export const getAllInquiries = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM inquiries ORDER BY created_at DESC");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};






export const getInquiryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query("SELECT * FROM inquiries WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};


export const updateInquiry = async (req, res) => {
  const { id } = req.params;
  const { name, contact_method, source, type, initial_notes, status } = req.body;
  try {
    await pool.query(
      "UPDATE inquiries SET name = ?, contact_method = ?, source = ?, type = ?, initial_notes = ?, status = ? WHERE id = ?",
      [name, contact_method, source, type, initial_notes, status, id]
    );
    res.status(200).json({ message: "Inquiry updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};










export const updateInquirystatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE inquiries SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.json({ message: "Inquiry status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};




export const deleteInquiry = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM inquiries WHERE id = ?", [id]);
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};






