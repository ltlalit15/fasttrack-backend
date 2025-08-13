import { pool } from "../Config/dbConnect.js";
 
export const addCase = async (req, res) => {
  const {
    client_id,
    case_type_id,
    case_number,
    status,
    case_details,
    start_date,
    next_hearing_date,
    trial_date,
    discovery_deadline,
    progress_percent,
    solicitor_id 
  } = req.body;

  try {
    // 1. Validate unique case_number
    const [existing] = await pool.query("SELECT id FROM cases WHERE case_number = ?", [case_number]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Case number already exists" });
    }

    // 2. Insert case data
    await pool.query(
      `INSERT INTO cases (
        client_id,  case_type_id, case_number, status,
        case_details, start_date, next_hearing_date, trial_date,
        discovery_deadline, progress_percent, solicitor_id
      ) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client_id,

        case_type_id,
        case_number,
        status,
        case_details,
        start_date,
        next_hearing_date,
        trial_date,
        discovery_deadline,
        progress_percent || 0,
        solicitor_id || null
      ]
    );

    res.status(201).json({ message: "Case added successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error adding case", error: err.message });
  }
};

export const updateCaseStatus = async (req, res) => {
  const { caseId } = req.params;
  const { status, progress_percent } = req.body;

  try {
    // Basic validation
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Build dynamic query
    let query = "UPDATE cases SET status = ?";
    const values = [status];

    if (progress_percent !== undefined) {
      query += ", progress_percent = ?";
      values.push(progress_percent);
    }

    query += " WHERE id = ?";
    values.push(caseId);

    // Run update
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Case status updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error updating case status", error: error.message });
  }
};


export const updateCase = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // 1. Fetch existing case
    const [rows] = await pool.query("SELECT * FROM cases WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    const existing = rows[0];

    // 2. Only update fields if provided
    const updatedData = {
      client_id: updates.client_id ?? existing.client_id,
      case_type_id: updates.case_type_id ?? existing.case_type_id,
      case_number: updates.case_number ?? existing.case_number,
      status: updates.status ?? existing.status,
      case_details: updates.case_details ?? existing.case_details,
      start_date: updates.start_date ?? existing.start_date,
      next_hearing_date: updates.next_hearing_date ?? existing.next_hearing_date,
      trial_date: updates.trial_date ?? existing.trial_date,
      discovery_deadline: updates.discovery_deadline ?? existing.discovery_deadline,
      progress_percent: updates.progress_percent ?? existing.progress_percent,
      solicitor_id: updates.solicitor_id ?? existing.solicitor_id // ✅ optional 
    };

    // 3. Update DB
    await pool.query(
      `UPDATE cases SET
        client_id = ?, case_type_id = ?, case_number = ?, status = ?,
        case_details = ?, start_date = ?, next_hearing_date = ?, trial_date = ?,
        discovery_deadline = ?, progress_percent = ?
       WHERE id = ?`,
      [
        updatedData.client_id,

        updatedData.case_type_id,
        updatedData.case_number,
        updatedData.status,
        updatedData.case_details,
        updatedData.start_date,
        updatedData.next_hearing_date,
        updatedData.trial_date,
        updatedData.discovery_deadline,
        updatedData.progress_percent,
        updatedData.solicitor_id,
        id
      ]
    );

    res.json({ message: "Case updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating case", error: err.message });
  }
};


export const getallcase = async (req, res) => {
  try {
    const [results] = await pool.query(`SELECT 
  a.*, 
  c.name AS client_name
FROM 
  cases a
LEFT JOIN 
  clients c ON a.client_id = c.id`);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clients", error: err.message });
  }
};



export const getCasesByClientId = async (req, res) => {
  const { client_id } = req.params;

  try {
    const [cases] = await pool.query(
      `SELECT 
  cases.*,
  casetypes.name AS case_type_name
FROM 
  cases
JOIN 
  casetypes ON cases.case_type_id = casetypes.id
WHERE 
  cases.client_id = ?;
`,
      [client_id]
    );

    if (cases.length === 0) {
      return res.status(404).json({ message: "No cases found for this client ID" });
    }

    res.status(200).json(cases);
  } catch (error) {
    console.error("Error fetching cases by client ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};




export const deletecase = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM cases WHERE id = ?", [id]);
    res.status(200).json({ message: "Cases deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
};



export const getCaseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query("SELECT * FROM cases WHERE id = ?", [id]);
    if (results.length === 0) return res.status(404).json({ message: "Case not found" });
    res.status(200).json(results[0]);
  } catch (err) {
    res.status(500).json({ message: "Internal error", error: err.message });
  }
}
