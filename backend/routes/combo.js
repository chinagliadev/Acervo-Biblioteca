const express = require('express');
const router = express.Router()
const comboPaisesController = require('../controller/comboPaisesController');

router.get('/selectPaises', comboPaisesController.getPaises);

module.exports = router;