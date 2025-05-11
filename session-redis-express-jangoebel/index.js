const express = require('express');
const { createClient } = require('redis');
const { RedisStore } = require('connect-redis');
const session = require('express-session');
const { hash, compareSync } = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const redisClient = createClient({
  url: 'redis://redis:6379',
});

redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

const app = express();
app.use(express.json());
app.use(
  session({
    store: redisStore,
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
  })
);

let users = [];

function checkSession(req, res, next) {
  if (!req.session.clientId)
    return res.status(401).json({ error: 'Não autorizado' });
  next();
}

app.post('/registration', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Dados inválidos' });

  const hashedPassword = await hash(password, 10);
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'Usuário criado', user: newUser });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user || !compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  req.session.clientId = user.id;
  res.status(200).json({ message: 'Login efetuado' });
});

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao destruir sessão' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  });
});

app.get('/profile', checkSession, (req, res) => {
  const user = users.find(u => u.id === req.session.clientId);
  res.json({ message: 'Sessão ativa', user });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
