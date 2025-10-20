const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Database = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's conversations
router.get('/conversations', authenticateToken, (req, res) => {
  const messages = Database.getAll('messages');
  const userMessages = messages.filter(
    m => m.senderId === req.user.id || m.receiverId === req.user.id
  );

  // Group by conversation partner
  const conversations = {};
  userMessages.forEach(msg => {
    const partnerId = msg.senderId === req.user.id ? msg.receiverId : msg.senderId;
    if (!conversations[partnerId]) {
      conversations[partnerId] = [];
    }
    conversations[partnerId].push(msg);
  });

  // Get last message for each conversation
  const users = Database.getAll('users');
  const conversationList = Object.entries(conversations).map(([partnerId, msgs]) => {
    const partner = users.find(u => u.id === partnerId);
    const lastMessage = msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const unreadCount = msgs.filter(m => m.receiverId === req.user.id && !m.read).length;

    return {
      partnerId,
      partner: partner ? {
        id: partner.id,
        name: partner.name,
        avatar: partner.avatar
      } : null,
      lastMessage,
      unreadCount
    };
  });

  conversationList.sort((a, b) =>
    new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  );

  res.json(conversationList);
});

// Get messages with specific user
router.get('/:userId', authenticateToken, (req, res) => {
  const messages = Database.getAll('messages');
  const conversation = messages.filter(
    m => (m.senderId === req.user.id && m.receiverId === req.params.userId) ||
         (m.senderId === req.params.userId && m.receiverId === req.user.id)
  );

  conversation.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Mark messages as read
  conversation.forEach(msg => {
    if (msg.receiverId === req.user.id && !msg.read) {
      Database.update('messages', msg.id, { read: true });
    }
  });

  res.json(conversation);
});

// Send message
router.post('/', authenticateToken, (req, res) => {
  const { receiverId, content, productId } = req.body;

  if (!content || !receiverId) {
    return res.status(400).json({ error: 'Content and receiverId are required' });
  }

  const receiver = Database.getById('users', receiverId);
  if (!receiver) {
    return res.status(404).json({ error: 'Receiver not found' });
  }

  const message = {
    id: uuidv4(),
    senderId: req.user.id,
    receiverId,
    content,
    productId: productId || null,
    read: false,
    createdAt: new Date().toISOString()
  };

  Database.create('messages', message);
  res.status(201).json(message);
});

// Mark message as read
router.put('/:id/read', authenticateToken, (req, res) => {
  const message = Database.getById('messages', req.params.id);

  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  if (message.receiverId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const updated = Database.update('messages', req.params.id, { read: true });
  res.json(updated);
});

module.exports = router;
