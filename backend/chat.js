const db = require('./db');

module.exports = function (io) {
  io.on('connection', (socket) => {
    console.log('A user connected with socket id:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined their personal room.`);
    }

    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
      // Here you could emit previous messages if needed
    });

    socket.on('sendMessage', async ({ conversationId, content }) => {
      if (!userId) {
        console.log('Cannot send message from an unidentified user.');
        return;
      }
      
      try {
        // The conversationId is actually the recipient's ID in a 1-on-1 chat
        const recipientId = conversationId;
        
        const message = {
          sender_id: userId,
          recipient_id: recipientId,
          content: content,
        };

        const savedMessage = await db.query(
          'INSERT INTO chat_messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING *',
          [message.sender_id, message.recipient_id, message.content]
        );

        // Emit to recipient's personal room
        io.to(recipientId).emit('newMessage', savedMessage.rows[0]);
        // Also emit to sender's personal room to confirm message sent
        io.to(userId).emit('newMessage', savedMessage.rows[0]);

      } catch (error) {
        console.error('Error saving or sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};