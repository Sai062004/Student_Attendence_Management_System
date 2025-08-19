const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');

router.post('/register', superAdminController.registerSuperAdmin);
router.post('/login', superAdminController.loginSuperAdmin);

module.exports = router;
