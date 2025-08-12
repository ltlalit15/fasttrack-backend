
import { pool } from "../Config/dbConnect.js";


export const Admindashboard = async (req, res) => {
  try {
    // Get total counts
    const [clientsCount] = await pool.query(`SELECT COUNT(*) AS totalclients FROM  clients WHERE role = 'client'`);
    const [casesCount] = await pool.query(`SELECT COUNT(*) AS totalcases FROM cases`);
    onst [staffSolicitorsCount] = await pool.query(`SELECT COUNT(*) AS totalstaff FROM staffSolicitors`);
    const [staffSolicitorsList] = await pool.query(`SELECT * FROM staffSolicitors`);
    
    // Current month inquiries
    const [inquiriesCount] = await pool.query(`
      SELECT COUNT(*) AS totalinquiries 
      FROM inquiries 
      WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())
    `);

    const [prevClients] = await pool.query(`
  SELECT COUNT(*) AS count 
  FROM clients 
  WHERE role = 'client'
    AND MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
    AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH)
`);


    const [prevInquiries] = await pool.query(`
      SELECT COUNT(*) AS count 
      FROM inquiries 
      WHERE MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
        AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH)
    `);

    const [prevCases] = await pool.query(`
      SELECT COUNT(*) AS count 
      FROM cases 
      WHERE MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)
        AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH)
    `);

    // Function to calculate percentage change
    const getPercentChange = (current, previous) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Calculate % changes
    const percentClients = getPercentChange(clientsCount[0].totalclients, prevClients[0].count);
    const percentInquiries = getPercentChange(inquiriesCount[0].totalinquiries, prevInquiries[0].count);
    const percentCases = getPercentChange(casesCount[0].totalcases, prevCases[0].count);

    // Response
    res.status(200).json({
      success: true,
      data: {
        totalclients: clientsCount[0].totalclients,
        totalinquiries: inquiriesCount[0].totalinquiries,
        totalcases: casesCount[0].totalcases,
        totalstaff: staffSolicitorsCount[0].totalstaff,
        staffList: staffSolicitorsList,
        percentChange: {
          users: percentClients,
          inquiries: percentInquiries,
          cases: percentCases
        },
        // chart_data: [
        //   { label: 'users', value: clientsCount[0].totalclients },
        //   { label: 'Inquiries', value: inquiriesCount[0].totalinquiries },
        //   { label: 'Cases', value: casesCount[0].totalcases }
        // ]
      }
    });

  } catch (error) {
    console.error("❌ Dashboard summary error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

