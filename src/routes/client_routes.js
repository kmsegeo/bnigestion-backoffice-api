const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const clientController = require('../controllers/client_controller')

router.get('/particuliers', clientController.findAllParticulier);
router.patch('/particuliers/:particulierId/valider', clientController.validerCompteParticulier);
router.put('/particuliers/:particulierId', clientController.updateParticulier);

module.exports = router;