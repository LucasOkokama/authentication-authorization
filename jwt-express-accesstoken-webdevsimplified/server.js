require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const posts = [];

app.post('/posts', authenticateToken, (req, res) => {
  const { title } = req.body;
  const post = { username: req.username, title };
  posts.push(post);
  return res.status(201).json({ message: 'Post created with success' });
});

app.get('/posts', authenticateToken, (req, res) => {
  return res.json(posts.filter(post => post.username === req.username));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) return res.sendStatus(403);
    req.username = decode.username;
    next();
  });
}

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
