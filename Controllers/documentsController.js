// controllers/documentsController.js
import { pool } from "../Config/dbConnect.js";
import express from "express";
import cloudinary from "cloudinary";
import fs from "fs";

// Cloudinary config
cloudinary.config({
  cloud_name: "dkqcqrrbp",
  api_key: "418838712271323",
  api_secret: "p12EKWICdyHWx8LcihuWYqIruWQ",
});


export const uploadClientDocument = async (req, res) => {
  const { client_id } = req.params;
  const file = req.files?.images;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "client_documents_docs",
    });

    await pool.query(
      "INSERT INTO documents (client_id, images) VALUES (?, ?)",
      [client_id, result.secure_url]
    );

    fs.unlink(file.tempFilePath, () => { });

    res.status(200).json({
      message: "Document uploaded successfully",
      uploadedFile: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: "Error uploading document", error: error.message });
  }
};



export const deleteClientDocument = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM documents WHERE id = ?", [id]);
    res.status(200).json({ message: "Documents deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

export const ClientDocuments = async (req, res) => {
  const { client_id } = req.params;
  try {
    const [results] = await pool.query("SELECT * FROM documents WHERE client_id = ?", [client_id]);
    if (results.length === 0) return res.status(404).json({ message: "Inquiry not found" });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};

export const getallClientDocuments = async (req, res) => {
  try {
    const sql = `SELECT 
  a.*, 
  c.name AS client_name
FROM 
  documents a
LEFT JOIN 
  clients c ON a.client_id = c.id`;
    const [rows] = await pool.query(sql);

    res.status(200).json({ status: 'success', data: rows });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

