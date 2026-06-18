require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./database/config');
const authRoutes = require('./routes/auth');
const combosRoutes = require('./routes/combo')

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax', 
    secure: false    
  }
}));

app.use('/auth', authRoutes);
app.use('/combos', combosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});