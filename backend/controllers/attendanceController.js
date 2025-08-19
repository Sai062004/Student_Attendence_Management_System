const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const ExcelJS = require('exceljs');

// ✅ Mark Attendance for a student on a given date
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status, subject } = req.body;

        const attendance = new Attendance({
            studentId,
            date,
            status,
            subject
        });

        await attendance.save();
        res.status(200).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get Attendance for a student by ID
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendanceRecords = await Attendance.find({ studentId });
        res.json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ Export Attendance by department, year, subject, and month number
exports.exportAttendanceBySubjectAndMonth = async (req, res) => {
    try {
        const { department, year, subject, month } = req.params;

        const students = await Student.find({ department, year });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance');

        // Header Row: S.No, Roll Number, Name, Dates...
        worksheet.addRow(['S.No', 'Roll Number', 'Name']);

        const currentYear = new Date().getFullYear();
        const selectedMonth = parseInt(month); // 1–12
        const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();

        // Add date headers: 01, 02, ..., 31
        for (let d = 1; d <= daysInMonth; d++) {
            worksheet.getRow(1).getCell(d + 3).value = `${String(d).padStart(2, '0')}`;
        }

        // Fill data for each student
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            const row = [i + 1, student.rollNumber, student.name];

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                const record = await Attendance.findOne({
                    studentId: student._id,
                    date: dateStr,
                    subject: subject
                });

                row.push(record ? record.status : '');
            }

            worksheet.addRow(row);
        }

        // Set Excel headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Attendance_${subject}_${month}_${year}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
