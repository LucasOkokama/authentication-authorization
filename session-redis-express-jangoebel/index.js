const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const sessionConfig = require('./config/sessionConfig');

const app = express();

app.use(express.json());
app.use(session(sessionConfig));

app.use('/users', userRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
