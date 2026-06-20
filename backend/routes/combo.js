const express = require('express');
const router = express.Router()
const comboPaisesController = require('../controller/combo');

router.get('/selectPaises', comboPaisesController.getPaises);
router.get('/selectGenero', comboPaisesController.getGenero);

module.exports = router;