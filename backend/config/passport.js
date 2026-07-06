
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const db = require('../db');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, photos } = profile;
      const email = emails[0].value;
      const avatar_url = photos[0].value;

      try {
        const user = await db.query('SELECT * FROM users WHERE social_id = $1', [id]);

        if (user.rows.length > 0) {
          return done(null, user.rows[0]);
        }

        const newUser = await db.query(
          'INSERT INTO users (username, email, provider, social_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [displayName, email, 'google', id, avatar_url]
        );

        done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/api/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, username, emails, photos } = profile;
      const email = emails[0].value;
      const avatar_url = photos[0].value;

      try {
        const user = await db.query('SELECT * FROM users WHERE social_id = $1', [id]);

        if (user.rows.length > 0) {
          return done(null, user.rows[0]);
        }

        const newUser = await db.query(
          'INSERT INTO users (username, email, provider, social_id, avatar_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [username, email, 'github', id, avatar_url]
        );

        done(null, newUser.rows[0]);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, user.rows[0]);
  } catch (err) {
    done(err, null);
  }
});