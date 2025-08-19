async function showAttendance() {
  const name = document.getElementById('name').value.trim();
  const roll = document.getElementById('rollNumber').value.trim();
  const dept = document.getElementById('department').value.trim();
  const year = document.getElementById('year').value.trim();
  const month = document.getElementById('month').value.trim().padStart(2, '0'); // Pad with 0 if needed

  // Fetch all students
  const studentRes = await fetch('http://localhost:5000/api/student/list');
  const allStudents = await studentRes.json();

  // Find the specific student
  const student = allStudents.find(
    s => s.name === name && s.rollNumber === roll && s.department === dept && s.year === year
  );

  if (!student) {
    alert("Student not found. Please check your details.");
    return;
  }

  // Fetch attendance for that student
  const res = await fetch(`http://localhost:5000/api/attendance/student/${student._id}`);
  const data = await res.json();

  const tableBody = document.getElementById('studentAttendanceBody');
  tableBody.innerHTML = '';

  // Filter by selected month
  const monthFiltered = data.filter(d => d.date.split('-')[1] === month);

  let presentCount = 0;

  // Show each attendance record
  for (let record of monthFiltered) {
    const row = `<tr>
      <td>${record.date}</td>
      <td>${record.subject || 'N/A'}</td>
      <td>${record.status}</td>
    </tr>`;
    tableBody.innerHTML += row;

    if (record.status === 'P') presentCount++;
  }

  const percent = monthFiltered.length > 0
    ? ((presentCount / monthFiltered.length) * 100).toFixed(0)
    : 0;

  document.getElementById('attendancePercent').innerText = `${percent}%`;

  // Show the section
  document.getElementById('student-attendance-section').style.display = 'block';
}
