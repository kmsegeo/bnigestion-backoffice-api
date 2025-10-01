const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const operationController = require('../controllers/operation_controller')

router.get('/', operationController.getAllOperations);
router.get('/attentes', operationController.getAllUnTreatedOp);
router.patch('/:ref/valider', operationController.validOperation);
router.patch('/:ref/rejeter', operationController.rejectedOperation);

module.exports = router;