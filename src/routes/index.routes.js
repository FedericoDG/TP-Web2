const { Router } = require('express');
const router = Router();

//routes files
const translate = require('./translate.routes');

router.use('/translate', translate);

module.exports = router;
