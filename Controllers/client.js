import { pool } from "../Config/dbConnect.js";
import bcrypt from "bcrypt";
import { generatetoken } from "../Config/jwt.js";
import multer from "multer";
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Ensure jwt is imported
const upload = multer();


export const addNewClient = async (req, res) => {
  const {
    password_reset_expires,
    password_reset_token,
    status,
    password,
    name,
    email,
    address,
    contact_number,
    date_of_birth,
    case_category,
    next_of_kin_name,
    next_of_kin_contact,
    next_of_kin_relationship,
    gp_name,
    gp_phone,
    gp_practice_address,
    hospital_details,
    accident_date,
    accident_location,
    accident_description,
    short_term_injuries,
    long_term_injuries,
    injury_description,
    severity,
    third_party_insurer,
    third_party_registration,
    third_party_contact,
    own_policy_number,
    own_provider,
    own_expiry_date,
    own_vehicle_make,
    own_vehicle_model,
    own_vehicle_registration,
    own_vehicle_year,
    past_accident_date,
    police_report_reference,
    past_accident_summary,
    phone,
    
  } = req.body;
//39

console.log("req.body",req.body)
  try {
    // Step 1: Check for duplicate email
    const [existing] = await pool.query("SELECT id FROM clients WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Step 2: Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Prepare SQL insert (excluding created_at and updated_at — handled by MySQL)
    const query = `
      INSERT INTO clients (
         password_reset_expires, password_reset_token, status, password,
        name, email, address, contact_number, date_of_birth, case_category,
        next_of_kin_name, next_of_kin_contact, next_of_kin_relationship,
        gp_name, gp_phone, gp_practice_address, hospital_details,
        accident_date, accident_location, accident_description,
        short_term_injuries, long_term_injuries, injury_description,
        severity, third_party_insurer, third_party_registration,
        third_party_contact, own_policy_number, own_provider, own_expiry_date,
        own_vehicle_make, own_vehicle_model, own_vehicle_registration,
        own_vehicle_year, past_accident_date, police_report_reference,
        past_accident_summary, phone
      ) VALUES (
         ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?
      )
    `;

    const values = [
       password_reset_expires, password_reset_token, status, hashedPassword,
      name, email, address, contact_number, date_of_birth, case_category,
      next_of_kin_name, next_of_kin_contact, next_of_kin_relationship,
      gp_name, gp_phone, gp_practice_address, hospital_details,
      accident_date, accident_location, accident_description,
      short_term_injuries, long_term_injuries, injury_description,
      severity, third_party_insurer, third_party_registration,
      third_party_contact, own_policy_number, own_provider, own_expiry_date,
      own_vehicle_make, own_vehicle_model, own_vehicle_registration,
      own_vehicle_year, past_accident_date, police_report_reference,
      past_accident_summary, phone
    ];

    const [insertResult] = await pool.query(query, values);

    return res.status(201).json({
      message: "Client created successfully",
      client_id: insertResult.insertId
    });

  } catch (err) {
    return res.status(500).json({
      message: "Error creating client",
      error: err.message
    });
  }
};

export const getClientmainById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "SELECT * FROM  clients WHERE id = ?",
      [id]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching client", error: err.message });
  }
};


export const getadmindetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get the user from `users` table
    const [userResult] = await pool.query(
      "SELECT  id, name, email , password , password_reset_token, password_reset_expires,phone, created_at, status  FROM clients WHERE id = ?",
      [id]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = { data: userResult[0] };
    return res.status(200).json(user);

  } catch (error) {
    console.error("Error fetching client:", error);
    return res.status(500).json({ message: "Error fetching client", error: error.message });
  }
};




export const getAllClient = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clients", error: err.message });
  }
};




// export const updateClient = async (req, res) => {
//   const { id: user_id } = req.params; // id is actually user_id here
//   const {
//     name,
//     email,
//     phone,
//     ...clientFields
//   } = req.body;

//   try {
//     // Check if client exists for this user_id
//     const [clientResult] = await pool.query("SELECT id FROM clients WHERE id = ?", [id]);
//     if (clientResult.length === 0) {
//       return res.status(404).json({ message: "Client not found for user_id: " + user_id });
//     }

//     // Update users table
//     if (name || email || phone) {
//       await pool.query(
//         "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?",
//         [name, email, phone, user_id]
//       );
//     }

//     // Update clients table using user_id
//     const fields = Object.keys(clientFields);
//     const values = Object.values(clientFields);

//     if (fields.length > 0) {
//       const setClause = fields.map(field => `${field} = ?`).join(', ');
//       values.push(user_id); // WHERE clause
//       await pool.query(
//         `UPDATE clients SET ${setClause} WHERE user_id = ?`,
//         values
//       );
//     }

//     res.status(200).json({ message: "Client updated successfully" });

//   } catch (err) {
//     res.status(500).json({ message: "Error updating client", error: err.message });
//   }
// };



export const updateClient = async (req, res) => {
  const { id } = req.params;

  const {
  
    password_reset_expires,
    password_reset_token,
    status,
    password,
    name,
    email,
    address,
    contact_number,
    date_of_birth,
    case_category,
    next_of_kin_name,
    next_of_kin_contact,
    next_of_kin_relationship,
    gp_name,
    gp_phone,
    gp_practice_address,
    hospital_details,
    accident_date,
    accident_location,
    accident_description,
    short_term_injuries,
    long_term_injuries,
    injury_description,
    severity,
    third_party_insurer,
    third_party_registration,
    third_party_contact,
    own_policy_number,
    own_provider,
    own_expiry_date,
    own_vehicle_make,
    own_vehicle_model,
    own_vehicle_registration,
    own_vehicle_year,
    past_accident_date,
    police_report_reference,
    past_accident_summary,
    phone
  } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE clients SET
       password_reset_expires = ?, password_reset_token = ?, status = ?,
        password = ?, name = ?, email = ?, address = ?, contact_number = ?, date_of_birth = ?,
        case_category = ?, next_of_kin_name = ?, next_of_kin_contact = ?, next_of_kin_relationship = ?,
        gp_name = ?, gp_phone = ?, gp_practice_address = ?, hospital_details = ?,
        accident_date = ?, accident_location = ?, accident_description = ?,
        short_term_injuries = ?, long_term_injuries = ?, injury_description = ?, severity = ?,
        third_party_insurer = ?, third_party_registration = ?, third_party_contact = ?,
        own_policy_number = ?, own_provider = ?, own_expiry_date = ?,
        own_vehicle_make = ?, own_vehicle_model = ?, own_vehicle_registration = ?, own_vehicle_year = ?,
        past_accident_date = ?, police_report_reference = ?, past_accident_summary = ?,
        phone = ?, updated_at = NOW()
      WHERE id = ?
      `,
      [
         password_reset_expires, password_reset_token, status,
        password, name, email, address, contact_number, date_of_birth,
        case_category, next_of_kin_name, next_of_kin_contact, next_of_kin_relationship,
        gp_name, gp_phone, gp_practice_address, hospital_details,
        accident_date, accident_location, accident_description,
        short_term_injuries, long_term_injuries, injury_description, severity,
        third_party_insurer, third_party_registration, third_party_contact,
        own_policy_number, own_provider, own_expiry_date,
        own_vehicle_make, own_vehicle_model, own_vehicle_registration, own_vehicle_year,
        past_accident_date, police_report_reference, past_accident_summary,
        phone, id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};




export const deleteClient = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM clients WHERE id = ?", [id]);
    res.status(200).json({ message: "Clients deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};




export const changePassword = async (req, res) => {
  const { userId } = req.params; // or use req.user.id if using JWT
  const { oldPassword, newPassword } = req.body;

  try {
    // 1. Get current hashed password from DB
    const [userRows] = await pool.query("SELECT password FROM clients WHERE id = ?", [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = userRows[0];

    // 2. Compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Update password in DB
    await pool.query("UPDATE clients SET password = ? WHERE id = ?", [hashedPassword, userId]);

    res.status(200).json({ message: "Password changed successfully." });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error while changing password." });
  }
};


