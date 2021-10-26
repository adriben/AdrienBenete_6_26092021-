const express = require('express');
const router = express();
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');

router.get('/', sauceCtrl.displayAllSauces);
router.post('/', multer, sauceCtrl.createSauce);

module.exports = router;