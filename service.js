require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());


const MASTODON_API_URL = process.env.MASTODON_BASE_URL;
const ACCESS_TOKEN = process.env.MASTODON_ACCESS_TOKEN;

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`
};

// Create Post
app.post('/create', async (req, res) => {
  const { status } = req.body;
  try {
    const response = await axios.post(`${MASTODON_API_URL}/api/v1/statuses`, 
      { status }, 
      { headers });
    res.status(200).json(response.data);
    console.log('Mastodon API Response:', response.data); // Log the response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Retrieve Post
app.get('/retrieve/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`${MASTODON_API_URL}/api/v1/statuses/${id}`, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Post
app.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await axios.delete(`${MASTODON_API_URL}/api/v1/statuses/${id}`, { headers });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
