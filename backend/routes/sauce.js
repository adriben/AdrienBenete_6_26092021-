const express = require('express');
const router = express();
const sauceCtrl = require('../controllers/sauce');

router.get('/', sauceCtrl.displayAllSauces);

module.exports = router;