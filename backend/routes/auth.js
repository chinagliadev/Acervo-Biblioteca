const express = require('express');
const router  = express.Router();
const auth = require('../controller/authController');
const middlewareAuth = require('../middlewares/auth');

router.post('/login', auth.login);
router.post('/register', auth.register);

router.get('/me', middlewareAuth, (req, res) => {
   console.log("Sessão recebida:", req.session.usuario);
  res.status(200).json({ usuario: req.session.usuario });
});


module.exports = router;