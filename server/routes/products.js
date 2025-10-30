const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Database = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all products with filters
router.get('/', (req, res) => {
  let products = Database.getAll('products');

  // Filter by category
  if (req.query.category) {
    products = products.filter(p => p.category === req.query.category);
  }

  // Filter by size
  if (req.query.size) {
    products = products.filter(p => p.size === req.query.size);
  }

  // Filter by gender
  if (req.query.gender) {
    products = products.filter(p => p.gender === req.query.gender);
  }

  // Filter by condition
  if (req.query.condition) {
    products = products.filter(p => p.condition === req.query.condition);
  }

  // Search by title or description
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm)
    );
  }

  // Filter by price range
  if (req.query.minPrice) {
    products = products.filter(p => p.price >= parseFloat(req.query.minPrice));
  }
  if (req.query.maxPrice) {
    products = products.filter(p => p.price <= parseFloat(req.query.maxPrice));
  }

  // Sort
  if (req.query.sort === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (req.query.sort === 'newest') {
    products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  res.json(products);
});

// Get single product
router.get('/:id', (req, res) => {
  const product = Database.getById('products', req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Create product
router.post('/', authenticateToken, upload.array('images', 5),
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty(),
    body('size').notEmpty(),
    body('gender').notEmpty(),
    body('condition').notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const product = {
      id: uuidv4(),
      ...req.body,
      price: parseFloat(req.body.price),
      sellerId: req.user.id,
      images,
      createdAt: new Date().toISOString(),
      status: 'available',
      views: 0,
      favorites: []
    };

    Database.create('products', product);
    res.status(201).json(product);
  }
);

// Update product
router.put('/:id', authenticateToken, upload.array('images', 5), (req, res) => {
  const product = Database.getById('products', req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : product.images;

  const updates = {
    ...req.body,
    images,
    updatedAt: new Date().toISOString()
  };

  const updated = Database.update('products', req.params.id, updates);
  res.json(updated);
});

// Delete product
router.delete('/:id', authenticateToken, (req, res) => {
  const product = Database.getById('products', req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (product.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  Database.delete('products', req.params.id);
  res.json({ message: 'Product deleted successfully' });
});

// Toggle favorite
router.post('/:id/favorite', authenticateToken, (req, res) => {
  const product = Database.getById('products', req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const favorites = product.favorites || [];
  const index = favorites.indexOf(req.user.id);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(req.user.id);
  }

  const updated = Database.update('products', req.params.id, { favorites });
  res.json(updated);
});

// Increment views
router.post('/:id/view', (req, res) => {
  const product = Database.getById('products', req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated = Database.update('products', req.params.id, { views: (product.views || 0) + 1 });
  res.json(updated);
});

module.exports = router;
