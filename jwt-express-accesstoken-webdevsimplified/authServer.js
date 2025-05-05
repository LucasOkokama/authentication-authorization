require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

let users = [];

let refreshTokens = [];

app.post('/token', (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken(decode.username);
    res.status(201).json({ accessToken });
  });
});

app.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  return res.sendStatus(204);
});

app.get('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  const accessToken = generateAccessToken(username);
  const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET);

  refreshTokens.push(refreshToken);

  return res.status(201).json({ accessToken, refreshToken });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(user => user.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Cannot find user' });
  }

  try {
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json(`Error comparing passwords: ${err}`);
      }

      if (!result) {
        return res.status(401).json({ message: 'Incorrect password' });
      }

      const accessToken = generateAccessToken(user.username);
      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET
      );

      refreshTokens.push(refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    });
  } catch (err) {
    return res.status(500).send();
  }
});

function generateAccessToken(username) {
  return (accessToken = jwt.sign(
    { username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15s' }
  ));
}

app.listen(4000, () => {
  console.log(`Server running on port 4000`);
});
