const request = require('supertest');
const app = require('../server');

describe('Server Endpoints', () => {
  test('GET /api/health should return server status', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Server is running');
  });

  test('POST /api/upload should reject when no file is provided', async () => {
    const response = await request(app)
      .post('/api/upload');
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('No file uploaded');
  });
});
