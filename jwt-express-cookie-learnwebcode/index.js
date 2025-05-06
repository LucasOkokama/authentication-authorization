const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

let users = [];

function cookieCheck(req, res, next) {
  const username = req.cookies['username'];

  if (!username) {
    return res.status(401).json({ message: 'Token not found' });
  }

  req.username = username;
  next();
}

app.post('/api/token', (req, res) => {
  const { name, email } = req.body;
  const payload = {
    name,
    email,
  };

  users.push(payload);

  const secret = 'mySecret';
  const nameJwt = jwt.sign({ username: payload.name }, secret, { expiresIn: '1h' });

  res.cookie('username', nameJwt, {
    // "expires" --> The cookie expires in 24 hours
    maxAge: 86400000,

    // "sameSite" --> Controls whether the cookie is sent with cross-site requests
    sameSite: 'strict',

    // "path" --> The cookie is accessible for APIs under the '/api' route
    path: '/api',

    // "domain" --> The cookie belongs to the 'example.com' domain
    //domain: 'example.com',

    // "secure" --> The cookie will be sent over HTTPS only
    //secure: true,

    // "HttpOnly" --> The cookie cannot be accessed by client-side scripts
    httpOnly: true,
  });
  res.status(201).json({
    message: 'User created!',
  });
});

app.get('/api/verify', cookieCheck, (req, res) => {
  const username = req.username;
  const secret = 'mySecret';

  try {
    const decoded = jwt.verify(username, secret);
    res.status(200).json({
      data: decoded,
    });
  } catch (err) {
    console.log(`Error: ${err}`);
    res.status(401).json({
      message: 'Invalid Token',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
