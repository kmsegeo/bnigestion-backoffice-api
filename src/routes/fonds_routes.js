const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const fondsController = require('../controllers/fonds_controller');

router.get('/', app_auth, fondsController.getAllFonds);
router.post('/', app_auth, fondsController.createFonds);
router.get('/:code', app_auth, fondsController.getOneFonds);

router.post('/vl', app_auth, fondsController.createVl);
router.get('/:code/vl', app_auth, fondsController.getLastByFonds);
router.get('/:code/vls', app_auth, fondsController.getAllVlsByFonds);

module.exports = router;