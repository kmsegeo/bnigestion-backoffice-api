const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const ressourcesController = require('../controllers/ressources_controller');

router.get('/civilites', ressourcesController.getCivilities);
router.get('/type-pieces', ressourcesController.getTypePieces);

module.exports = router;