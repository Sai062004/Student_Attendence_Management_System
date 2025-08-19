const Student = require('../models/Student');

// Add a new student
exports.addStudent = async (req, res) => {
    try {
        const { name, rollNumber, department, year } = req.body;
        const newStudent = new Student({ name, rollNumber, department, year });
        await newStudent.save();
        res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Bulk Add Students
exports.bulkAddStudents = async (req, res) => {
  try {
    const students = req.body.students;
    await Student.insertMany(students);
    res.status(201).json({ message: `${students.length} students added successfully!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
