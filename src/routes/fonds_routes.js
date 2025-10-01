const express = require('express');
const router = express.Router();
const app_auth = require('../middlewares/app_auth');
const session_verify = require('../middlewares/session_verify');
const fondsController = require('../controllers/fonds_controller');

router.get('/', fondsController.getAllFonds);

router.post('/', fondsController.createFonds);
router.get('/:code', fondsController.getOneFonds);

router.post('/:code/vl', fondsController.createVl);
router.get('/:code/vls', fondsController.getAllVlsByFonds);

module.exports = router;