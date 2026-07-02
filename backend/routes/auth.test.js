const request = require('supertest');
const express = require('express');
const authRouter = require('./auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  it('should return 200 OK for the root route', async () => {
    const res = await request(app).get('/api/auth/');
    expect(res.statusCode).toEqual(200);
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: `testuser_${Date.now()}@example.com`,
        password: 'password',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a registered user', async () => {
    const user = {
      username: 'testuser2',
      email: `testuser2_${Date.now()}@example.com`,
      password: 'password',
    };

    await request(app)
      .post('/api/auth/register')
      .send(user);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});