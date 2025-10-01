const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const clientController = require('../controllers/client_controller')
const operationController = require('../controllers/operation_controller')

router.get('/particuliers', clientController.findAllParticulier);
router.patch('/particuliers/:particulierId/valider', clientController.validerCompteParticulier);

router.get('/operations/attentes', operationController.getAllUnTreatedOp);
router.patch('/operations/:ref/valider', operationController.validOperation);
router.patch('/operations/:ref/rejeter', operationController.rejectedOperation);

module.exports = router;