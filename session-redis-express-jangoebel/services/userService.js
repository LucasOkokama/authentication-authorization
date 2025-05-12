const { hash, compareSync } = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

let users = [];

exports.createUser = async (email, password) => {
  const hashedPassword = await hash(password, 10);
  const newUser = { id: uuidv4(), email, password: hashedPassword };
  users.push(newUser);
  return newUser;
};

exports.authenticateUser = (email, password) => {
  const user = users.find(u => u.email === email);
  if (!user || !compareSync(password, user.password)) {
    throw new Error('Credenciais inválidas');
  }
  return user;
};
