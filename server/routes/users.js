const express = require('express');
const Database = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  const user = Database.getById('users', req.user.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// Get user by ID (public profile)
router.get('/:id', (req, res) => {
  const user = Database.getById('users', req.params.id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Return only public information
  res.json({
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    createdAt: user.createdAt
  });
});

// Get user's products
router.get('/:id/products', (req, res) => {
  const products = Database.getAll('products').filter(
    p => p.sellerId === req.params.id
  );
  res.json(products);
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, bio, phone } = req.body;

  const updates = {
    name,
    bio,
    phone,
    updatedAt: new Date().toISOString()
  };

  if (name) {
    updates.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }

  const updated = Database.update('users', req.user.id, updates);
  const { password, ...userWithoutPassword } = updated;
  res.json(userWithoutPassword);
});

// Get user's favorites
router.get('/profile/favorites', authenticateToken, (req, res) => {
  const products = Database.getAll('products').filter(
    p => p.favorites && p.favorites.includes(req.user.id)
  );
  res.json(products);
});

module.exports = router;
