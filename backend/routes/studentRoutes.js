const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Add Student
router.post('/add', studentController.addStudent);

// List Students
router.get('/list', studentController.getAllStudents);

router.post('/bulk-add', studentController.bulkAddStudents);

router.delete('/delete/:id', studentController.deleteStudent);


module.exports = router;
