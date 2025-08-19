const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/register', adminController.registerAdmin);
router.post('/login', adminController.loginAdmin);
router.put('/approve/:id', adminController.approveAdmin); 
router.put('/block/:id', adminController.blockAdmin);
router.get('/list', adminController.getAllAdmins);
router.delete('/delete/:id', adminController.deleteAdmin);


module.exports = router;

