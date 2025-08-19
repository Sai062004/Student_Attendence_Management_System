const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'superadmin' },
});

module.exports = mongoose.model('SuperAdmin', superAdminSchema);

async function approveAdmin(adminId) {
  const res = await fetch(`http://localhost:5000/api/superadmin/approve/${adminId}`, {
    method: 'PUT'
  });

  const data = await res.json();
  alert(data.message);

  // ✅ Refresh admin list after approval
  if (res.status === 200) {
    loadAdmins();
  }
}

async function loadAdmins() {
  const res = await fetch('http://localhost:5000/api/superadmin/admins');
  const admins = await res.json();

  const tableBody = document.getElementById('adminTableBody'); // this must match <tbody id="adminTableBody">
  tableBody.innerHTML = '';

  admins.forEach(admin => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${admin.name}</td>
      <td>${admin.email}</td>
      <td>${admin.department}</td>
      <td>${admin.year}</td>
      <td>${admin.isBlocked ? 'Blocked ❌' : 'Active ✅'}</td>
      <td>
        <button onclick="approveAdmin('${admin._id}')">Approve</button>
        <button onclick="deleteAdmin('${admin._id}')">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

