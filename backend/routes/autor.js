const express = require('express');
const router = express.Router();
const autorController = require('../controller/autorController');

router.post('/', autorController.salvar);
router.get('/', autorController.consultar);
router.patch('/:id', autorController.editar);
router.delete('/:id', autorController.deletar);
module.exports = router