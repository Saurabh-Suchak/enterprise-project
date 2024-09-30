/*  Author : Purva Bansod
    Description : Test file for the app.js
*/
const request = require('supertest');
const axios = require('axios');
const app = require('../src/app');

jest.mock('axios');

describe('Mastodon API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /create', () => {
    it('should create a post successfully', async () => {
      const mockResponse = { data: { id: '123', content: 'Test post' } };
      axios.post.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/create')
        .send({ status: 'Test post' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/statuses'),
        { status: 'Test post' },
        { headers: expect.any(Object) }
      );
    });

    it('should handle errors when creating a post', async () => {
      const errorMessage = 'API Error';
      axios.post.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .post('/create')
        .send({ status: 'Test post' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('GET /retrieve/:id', () => {
    it('should retrieve a post successfully', async () => {
      const mockResponse = { data: { id: '123', content: 'Test post' } };
      axios.get.mockResolvedValue(mockResponse);

      const response = await request(app).get('/retrieve/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResponse.data);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/statuses/123'),
        { headers: expect.any(Object) }
      );
    });

    it('should handle errors when retrieving a post', async () => {
      const errorMessage = 'API Error';
      axios.get.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).get('/retrieve/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete a post successfully', async () => {
      axios.delete.mockResolvedValue({});

      const response = await request(app).delete('/delete/123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Post deleted successfully" });
      expect(axios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/v1/statuses/123'),
        { headers: expect.any(Object) }
      );
    });

    it('should handle errors when deleting a post', async () => {
      const errorMessage = 'API Error';
      axios.delete.mockRejectedValue(new Error(errorMessage));

      const response = await request(app).delete('/delete/123');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: errorMessage });
    });
  });
});