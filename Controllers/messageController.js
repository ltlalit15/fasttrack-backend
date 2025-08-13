// Controllers/message.controller.js
import { pool } from "../Config/dbConnect.js";

export const handleChatSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("🟢 Socket connected:", socket.id);

        // Join private room
        socket.on('join', (userId) => {
            socket.join(String(userId));
            console.log(`✅ User ${userId} joined their room`);
        });

        // Send message
        socket.on('send_message', async ({ sender_id, receiver_id, message }) => {
            try {
                // Save in DB
                const [result] = await pool.query(
                    `INSERT INTO messages (sender_id, receiver_id, message, created_at, status) 
                     VALUES (?, ?, ?, NOW(), 'sent')`,
                    [sender_id, receiver_id, message]
                );

                // Fetch the saved message with names
                const [saved] = await pool.query(
                    `SELECT m.*, s.name AS sender_name, r.name AS receiver_name 
                     FROM messages m
                     LEFT JOIN clients s ON m.sender_id = s.id
                     LEFT JOIN clients r ON m.receiver_id = r.id
                     WHERE m.id = ?`,
                    [result.insertId]
                );

                const messageData = saved[0];

                // Emit to sender and receiver
                io.to(String(sender_id)).emit('new_message', messageData);
                io.to(String(receiver_id)).emit('new_message', messageData);

            } catch (err) {
                console.error("❌ send_message socket error:", err);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });

        // Fetch messages between two users
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
