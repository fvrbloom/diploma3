const express = require('express');
const router = express.Router();
const News = require('../models/News');
const User = require('../models/user'); // Add this line

// Add a news sentence (admin only)
router.post('/add', async (req, res) => {
  const { username, sentence } = req.body;
  
  if (!username) {
    return res.status(401).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ username });
    if (user && user.isAdmin) {
      const newNews = new News({ sentence });
      await newNews.save();
      res.status(201).json({ message: 'News added successfully' });
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch all news sentences
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ date: 1 }); // Sorted by date ascending
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
