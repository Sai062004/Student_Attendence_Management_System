const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// Mark attendance
router.post('/mark', attendanceController.markAttendance);

// Get attendance by student ID
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);

router.get('/export/:department/:year/:subject/:month', attendanceController.exportAttendanceBySubjectAndMonth);

module.exports = router;

