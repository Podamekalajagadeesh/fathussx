const db = require('../db');
const { getIo } = require('../socket');

/**
 * Creates a notification and emits a socket event.
 * @param {number} userId The ID of the user to notify.
 * @param {string} type The type of notification.
 * @param {string} message The notification message.
 * @param {string} [link] An optional link for the notification.
 */
const createNotification = async (userId, type, message, link = null) => {
  try {
    const newNotification = await db.query(
      'INSERT INTO notifications (user_id, type, message, link) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, type, message, link]
    );

    const io = getIo();
    io.to(userId.toString()).emit('notification', newNotification.rows[0]);

    return newNotification.rows[0];
  } catch (err) {
    console.error(`Error creating notification for user ${userId}:`, err);
  }
};

module.exports = { createNotification };