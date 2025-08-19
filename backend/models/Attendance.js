const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  date: String, // Example: "2025-07-10"
  status: { type: String, enum: ['P', 'Ab'], default: 'Ab' },
  subject: { type: String, required: true } // 🆕 Added subject field
});

module.exports = mongoose.model('Attendance', attendanceSchema);
