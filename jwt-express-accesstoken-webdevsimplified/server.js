require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const users = [];

const posts = [];

app.get('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  res.status(201).json({ accessToken: accessToken });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Cannot find used' });
  }

  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json(`Error comparing passwords: ${err}`);
      }

      if (!result) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const accessToken = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '15m',
        }
      );
      return res.status(200).json({ accessToken: accessToken });
    });
  } catch (err) {
    return res.status(500).send();
  }
});

app.get('/posts', authenticateToken, (req, res) => {
  return res.json(posts.filter(post => post.username === req.username));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
    if (err) return res.sendStatus(403);

    req.username = username;
    next();
  });
}

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
