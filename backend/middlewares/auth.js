
function autenticado(req, res, next) {
  if (req.session.usuario) {
    return next(); 
  }
  
  res.status(401).json({ mensagem: 'Não autorizado' });
}

module.exports = autenticado;