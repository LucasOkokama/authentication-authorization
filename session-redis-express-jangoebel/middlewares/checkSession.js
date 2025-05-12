function checkSession(req, res, next) {
  if (!req.session || !req.session.clientId) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  next();
}

module.exports = checkSession;
