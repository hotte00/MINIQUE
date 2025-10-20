const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Database = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', authenticateToken, (req, res) => {
  const carts = Database.getAll('carts');
  const userCart = carts.find(c => c.userId === req.user.id) || { userId: req.user.id, items: [] };

  // Populate product details
  const products = Database.getAll('products');
  userCart.items = userCart.items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product
    };
  }).filter(item => item.product); // Remove items with deleted products

  res.json(userCart);
});

// Add item to cart
router.post('/items', authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = Database.getById('products', productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.status !== 'available') {
    return res.status(400).json({ error: 'Product is not available' });
  }

  const carts = Database.getAll('carts');
  let userCart = carts.find(c => c.userId === req.user.id);

  if (!userCart) {
    userCart = {
      id: uuidv4(),
      userId: req.user.id,
      items: [],
      createdAt: new Date().toISOString()
    };
    Database.create('carts', userCart);
  } else {
    // Check if item already in cart
    const existingItem = userCart.items.find(i => i.productId === productId);
    if (existingItem) {
      return res.status(400).json({ error: 'Item already in cart' });
    }
  }

  userCart.items.push({
    id: uuidv4(),
    productId,
    quantity,
    addedAt: new Date().toISOString()
  });

  Database.update('carts', userCart.id, userCart);
  res.json(userCart);
});

// Remove item from cart
router.delete('/items/:itemId', authenticateToken, (req, res) => {
  const carts = Database.getAll('carts');
  const userCart = carts.find(c => c.userId === req.user.id);

  if (!userCart) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  userCart.items = userCart.items.filter(i => i.id !== req.params.itemId);
  Database.update('carts', userCart.id, userCart);
  res.json(userCart);
});

// Clear cart
router.delete('/', authenticateToken, (req, res) => {
  const carts = Database.getAll('carts');
  const userCart = carts.find(c => c.userId === req.user.id);

  if (userCart) {
    Database.update('carts', userCart.id, { items: [] });
  }

  res.json({ message: 'Cart cleared' });
});

module.exports = router;
