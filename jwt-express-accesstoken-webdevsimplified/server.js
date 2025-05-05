require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const users = [{ username: 'Admin', password: '12345' }];

const posts = [
  { username: 'Kyle', title: 'Post 1' },
  { username: 'Kyle', title: 'Post 2' },
];

app.get('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  res.status(201).json({ accessToken: accessToken });
});

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
