const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const clientController = require('../controllers/client_controller')
const operationController = require('../controllers/operation_controller')

router.get('/particuliers', app_auth, clientController.findAllParticulier);
router.patch('/particuliers/:particulierId/valider', app_auth, clientController.validerCompteParticulier);

router.get('/operations/attentes', app_auth, operationController.getAllUnTreatedOp);
router.patch('/operations/:ref/valider', app_auth, operationController.validerOperation);

module.exports = router;