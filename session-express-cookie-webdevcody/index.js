import { hash, compare } from 'bcrypt';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(express.json());
app.use(cookieParser());

let sessions = [];
let users = [];
let posts = [
  {
    id: 1,
    title: 'Como os castores constroem suas represas?',
    name: 'beaverBuilders',
  },
  { id: 2, title: 'Animais mais rápidos do mundo', name: 'fastAnimals' },
  { id: 3, title: 'Curiosidades sobre os golfinhos', name: 'dolphinFacts' },
  { id: 4, title: 'Top 5 animais em extinção', name: 'endangeredAnimals' },
  { id: 5, title: 'Diferença entre felinos e caninos', name: 'catsVsDogs' },
  { id: 6, title: 'O que torna o polvo tão inteligente?', name: 'octopusMind' },
  { id: 7, title: 'Animais que mudam de cor', name: 'colorChangingAnimals' },
  {
    id: 8,
    title: 'Animais noturnos e como eles enxergam no escuro',
    name: 'nocturnalVision',
  },
  {
    id: 9,
    title: 'Os sons mais estranhos feitos por animais',
    name: 'weirdAnimalSounds',
  },
];

app.post('/registration', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hash(password, 10);

  const user = { username, password: hashedPassword };
  users.push(user);

  generateSessionId(res);

  return res.status(201).json(user);
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundedUser = users.find(user => user.username === username);

  if (!foundedUser) return res.status(404).json({ message: 'User not found' });

  const passwordMatch = await compare(password, foundedUser.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  generateSessionId(res);

  return res.status(201).json(foundedUser);
});

app.post('/logout', cookieCheck, (req, res) => {
  const sessionId = req.cookies['sessionId'];

  sessions = sessions.filter(session => session.id != sessionId);

  res.clearCookie('sessionId');
  return res.status(200).json({ message: 'You are logged out' });
});

app.get('/posts', cookieCheck, (req, res) => {
  return res.json(posts);
});

function generateSessionId(res) {
  const sessionId = sessions.length + 1;
  sessions.push({ id: sessionId });
  res.cookie('sessionId', sessionId, {
    maxAge: 86400000,
    sameSite: 'strict',
    path: '/',
    httpOnly: true,
  });
}

function cookieCheck(req, res, next) {
  const sessionId = parseInt(req.cookies['sessionId']);

  if (sessions.some(session => session.id === sessionId)) {
    return next();
  }
  return res.status(401).json({ message: 'You need to log in!' });
}

app.listen(3000, () => {
  console.log('Server is running or port 3000');
});
