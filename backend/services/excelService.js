const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const generateAttendanceExcel = async (department, year) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Attendance Sheet');

    const students = await Student.find({ department, year });
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const yearNum = currentDate.getFullYear();
    const daysInMonth = new Date(yearNum, month, 0).getDate();

    // Header Row
    const headers = ['Roll No', 'Name'];
    for (let d = 1; d <= daysInMonth; d++) {
        headers.push(d.toString().padStart(2, '0'));
    }
    headers.push('% Attendance');
    sheet.addRow(headers);

    // Data Rows
    for (let student of students) {
        const row = [student.rollNumber, student.name];
        let presentCount = 0;

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${yearNum}-${month.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
            const record = await Attendance.findOne({ studentId: student._id, date: dateStr });

            if (record && record.status === 'P') {
                row.push('P');
                presentCount++;
            } else if (record && record.status === 'Ab') {
                row.push('Ab');
            } else {
                row.push('-');
            }
        }

        const percent = ((presentCount / daysInMonth) * 100).toFixed(0);
        row.push(`${percent}%`);
        sheet.addRow(row);
    }

    return workbook;
};

module.exports = { generateAttendanceExcel };
