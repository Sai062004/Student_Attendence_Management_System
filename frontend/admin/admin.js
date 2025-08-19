// Subject list mapping by year
const subjectsByYear = {
  "I": ["LAC", "Physics", "IP"],
  "II": ["DS", "OOP", "DBMS"],
  "III": ["OOSE", "OS", "DL"],
  "IV": ["IoT", "Blockchain", "Cyber Security"]
};

// Event Listeners
document.getElementById('department').addEventListener('input', loadSubjects);
document.getElementById('year').addEventListener('input', loadSubjects);

// Load subjects based on year
function loadSubjects() {
  const year = document.getElementById("year").value.trim().toUpperCase();
  const subjectDropdown = document.getElementById("subjectDropdown");

  subjectDropdown.innerHTML = '<option value="">-- Select Subject --</option>';

  if (!subjectsByYear[year]) {
    subjectDropdown.style.display = "none";
    return;
  }

  subjectsByYear[year].forEach(subject => {
    const option = document.createElement('option');
    option.value = subject;
    option.textContent = subject;
    subjectDropdown.appendChild(option);
  });

  subjectDropdown.style.display = "inline-block";
}

// Load students based on department, year, subject and month
async function loadStudents() {
  const department = document.getElementById("department").value.trim();
  const year = document.getElementById("year").value.trim();
  const subject = document.getElementById("subjectDropdown").value.trim();
  const selectedMonth = parseInt(document.getElementById("month").value);

  if (!department || !year || !subject || !selectedMonth) {
    alert("Please enter Department, Year, Subject, and Month.");
    return;
  }

  const res = await fetch('http://localhost:5000/api/student/list');
  const students = await res.json();

  const filtered = students.filter(s => s.department === department && s.year === year);

  if (filtered.length === 0) {
    alert('No students found!');
    return;
  }

  document.getElementById('attendance-section').style.display = 'block';

  const tableHead = document.getElementById('tableHead');
  const tableBody = document.getElementById('tableBody');
  tableHead.innerHTML = '';
  tableBody.innerHTML = '';

  const currentYear = new Date().getFullYear();
  const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();

  // Header row
  let headerRow = `<tr><th>Roll No</th><th>Name</th>`;
  for (let d = 1; d <= daysInMonth; d++) {
    headerRow += `<th>${String(d).padStart(2, '0')}</th>`;
  }
  headerRow += `<th>%</th></tr>`;
  tableHead.innerHTML = headerRow;

  // Student rows
  for (let student of filtered) {
    let rowHTML = `<tr data-id="${student._id}"><td>${student.rollNumber}</td><td>${student.name}</td>`;
    for (let d = 1; d <= daysInMonth; d++) {
      rowHTML += `
        <td>
          <select>
            <option value="">-</option>
            <option value="P">P</option>
            <option value="Ab">Ab</option>
          </select>
        </td>`;
    }
    rowHTML += `<td class="percent">0%</td></tr>`;
    tableBody.innerHTML += rowHTML;
  }
}

// Submit attendance with subject + month info
async function submitAttendance() {
  const rows = document.querySelectorAll('#tableBody tr');
  const currentYear = new Date().getFullYear();
  const selectedMonth = parseInt(document.getElementById("month").value);
  const subject = document.getElementById("subjectDropdown").value;

  const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();

  for (let row of rows) {
    const studentId = row.getAttribute('data-id');
    const selects = row.querySelectorAll('select');
    let presentCount = 0;

    for (let i = 0; i < daysInMonth; i++) {
      const status = selects[i].value;
      if (status === 'P') presentCount++;

      if (status === 'P' || status === 'Ab') {
        const date = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
        await fetch('http://localhost:5000/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId, date, status, subject })
        });
      }
    }

    const percentage = ((presentCount / daysInMonth) * 100).toFixed(0);
    row.querySelector('.percent').innerText = `${percentage}%`;
  }

  alert('Attendance submitted successfully!');
}

// Download Excel sheet for selected subject
function downloadExcel() {
  const department = document.getElementById('department').value;
  const year = document.getElementById('year').value;
  const subject = document.getElementById('subjectDropdown').value;
  const month = document.getElementById("month").value;

  if (!department || !year || !subject || !month) {
    alert('Please enter Department, Year, Subject, and Month.');
    return;
  }

  const url = `http://localhost:5000/api/attendance/export/${encodeURIComponent(department)}/${encodeURIComponent(year)}/${encodeURIComponent(subject)}/${month}`;
  window.open(url, '_blank');
}
