const bcrypt = require('bcrypt');
const conexao = require('../database/config');

exports.register = async (req, res) => {
  const { name, email, senha, confirmarSenha } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ mensagem: 'Nome deve ser preenchido' });
    }

    if (!email) {
      return res.status(400).json({ mensagem: 'Email deve ser preenchido' });
    }

    if (!senha) {
      return res.status(400).json({ mensagem: 'Senha deve ser preenchida' });
    }

    if (senha != confirmarSenha) {
      return res.status(400).json({ mensagem: 'Senha devem ser iguais' });
    }

    const resultado = await conexao.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (resultado.rows.length > 0) {
      return res.status(400).json({ mensagem: 'Email já possui cadastro' });
    }

    const hash = await bcrypt.hash(senha, 10);

    const rowEffect = await conexao.query(
      'INSERT INTO users (name, email, senha) VALUES ($1, $2, $3)',
      [name, email, hash]
    );

    if (rowEffect.rowCount <= 0) {
      return res.status(500).json({ mensagem: 'Usuário não foi criado' });
    }

    res.status(201).json({ mensagem: 'Usuário criado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ mensagem: 'Email deve ser preenchido' });
    }

    if (!senha) {
      return res.status(400).json({ mensagem: 'Senha deve ser preenchida' });
    }

    const resultado = await conexao.query(
      'SELECT * FROM users WHERE email = $1 AND status = 0',
      [email]
    );

    const user = resultado.rows[0];

    if (!user) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    req.session.usuario = { id: user.id, nome: user.name };
    console.log("Sessão criada:", req.session.usuario);
    console.log("Session ID:", req.sessionID);
    res.status(200).json({ mensagem: 'Login realizado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno' });
  }
};