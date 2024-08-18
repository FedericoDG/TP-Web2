const { Router } = require('express');
const router = Router();

//controller
const translate = require('../controllers/translate.controller');

//routes
router.post('/', translate.post);

module.exports = router;
