const userService = require('../services/userService');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = await userService.createUser(email, password);
    res.status(201).json({ message: 'Usuário criado', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.authenticateUser(email, password);
    req.session.clientId = user.id;
    res.status(200).json({ message: 'Login efetuado' });
  } catch (error) {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao destruir sessão' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  });
};

exports.profile = (req, res) => {
  res.json({ message: 'Sessão ativa', clientId: req.session.clientId });
};
