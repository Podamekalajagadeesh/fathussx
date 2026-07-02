const db = require('../db');
const { createNotification } = require('./notifications');

/**
 * Awards an achievement to a user if they haven't already earned it.
 * @param {number} userId The ID of the user.
 * @param {string} achievementSlug The unique slug of the achievement.
 */
const awardAchievement = async (userId, achievementSlug) => {
  try {
    // 1. Get the achievement ID from the slug
    const achievementRes = await db.query('SELECT id FROM achievements WHERE slug = $1', [achievementSlug]);
    if (achievementRes.rows.length === 0) {
      console.warn(`Achievement with slug '${achievementSlug}' not found.`);
      return;
    }
    const achievementId = achievementRes.rows[0].id;

    // 2. Check if the user already has this achievement
    const existingAward = await db.query(
      'SELECT id FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );

    // 3. If they don't have it, insert a new record
    if (existingAward.rows.length === 0) {
      await db.query(
        'INSERT INTO user_achievements (user_id, achievement_id) VALUES ($1, $2)',
        [userId, achievementId]
      );
      console.log(`Awarded achievement '${achievementSlug}' to user ${userId}`);

      // Create a notification for the user
      const achievement = await db.query('SELECT name FROM achievements WHERE id = $1', [achievementId]);
      const message = `You've unlocked a new achievement: ${achievement.rows[0].name}!`;
      const link = '/profile';
      await createNotification(userId, 'achievement_unlocked', message, link);
    }
  } catch (err) {
    console.error(`Error awarding achievement '${achievementSlug}' to user ${userId}:`, err);
  }
};

module.exports = { awardAchievement };