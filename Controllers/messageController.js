import { pool } from "../Config/dbConnect.js";

// ✅ API: Send a message
export const send_message = async (req, res) => {
    try {
        const { sender_id, receiver_id, message } = req.body;

        const [result] = await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, message, created_at, status) 
             VALUES (?, ?, ?, NOW(), 'sent')`,
            [sender_id, receiver_id, message]
        );

        const [saved] = await pool.query(
            `SELECT m.*, s.name AS sender_name, r.name AS receiver_name 
             FROM messages m
             LEFT JOIN clients s ON m.sender_id = s.id
             LEFT JOIN clients r ON m.receiver_id = r.id
             WHERE m.id = ?`,
            [result.insertId]
        );

        res.status(200).json(saved[0]);
    } catch (err) {
        console.error("❌ send_message API error:", err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// ✅ API: Get messages between two users
export const get_messages = async (req, res) => {
    try {
        const { user1, user2 } = req.params;

        const [rows] = await pool.query(
            `SELECT m.*, s.name AS sender_name, r.name AS receiver_name 
             FROM messages m
             LEFT JOIN clients s ON m.sender_id = s.id
             LEFT JOIN clients r ON m.receiver_id = r.id
             WHERE (m.sender_id = ? AND m.receiver_id = ?)
                OR (m.sender_id = ? AND m.receiver_id = ?)
             ORDER BY m.created_at ASC`,
            [user1, user2, user2, user1]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.error("❌ get_messages API error:", err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// ✅ Socket handler remains the same
export const handleChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        socket.on('join', (userId) => {
            socket.join(String(userId));
            console.log(`✅ User ${userId} joined their room`);
        });

        socket.on('send_message', async ({ sender_id, receiver_id, message }) => {
            try {
                const [result] = await pool.query(
                    `INSERT INTO messages (sender_id, receiver_id, message, created_at, status) 
                     VALUES (?, ?, ?, NOW(), 'sent')`,
                    [sender_id, receiver_id, message]
                );

                const [saved] = await pool.query(
                    `SELECT m.*, s.name AS sender_name, r.name AS receiver_name 
                     FROM messages m
                     LEFT JOIN clients s ON m.sender_id = s.id
                     LEFT JOIN clients r ON m.receiver_id = r.id
                     WHERE m.id = ?`,
                    [result.insertId]
                );

                const messageData = saved[0];
                io.to(String(sender_id)).emit('new_message', messageData);
                io.to(String(receiver_id)).emit('new_message', messageData);
            } catch (err) {
                console.error("❌ send_message socket error:", err);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });

        socket.on('get_messages', async ({ user1, user2 }) => {
            try {
                const [rows] = await pool.query(
                    `SELECT m.*, s.name AS sender_name, r.name AS receiver_name 
                     FROM messages m
                     LEFT JOIN clients s ON m.sender_id = s.id
                     LEFT JOIN clients r ON m.receiver_id = r.id
                     WHERE (m.sender_id = ? AND m.receiver_id = ?)
                        OR (m.sender_id = ? AND m.receiver_id = ?)
                     ORDER BY m.created_at ASC`,
                    [user1, user2, user2, user1]
                );
                socket.emit('messages', rows);
            } catch (err) {
                console.error("❌ get_messages socket error:", err);
                socket.emit('message_error', { error: 'Failed to fetch messages' });
            }
        });

        socket.on('disconnect', () => {
            console.log("🔴 Socket disconnected:", socket.id);
        });
    });
};
