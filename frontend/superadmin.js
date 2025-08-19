// Load all admins
async function loadAdmins() {
  try {
    const res = await fetch('http://localhost:5000/api/admin/list');
    if (!res.ok) throw new Error("Failed to fetch admins");

    const admins = await res.json();
    const body = document.getElementById('adminTableBody');
    body.innerHTML = '';

    admins.forEach(admin => {
      const status = admin.approved && !admin.isBlocked ? 'Approved ✅' : 'Blocked ❌';
      const buttonText = admin.approved ? 'Block' : 'Approve';

      body.innerHTML += `
        <tr>
          <td>${admin.name}</td>
          <td>${admin.email}</td>
          <td>${admin.department}</td>
          <td>${admin.year}</td>
          <td>${status}</td>
          <td>
            <button onclick="toggleApproval('${admin._id}')">${buttonText}</button>
            <button onclick="deleteAdmin('${admin._id}')">Delete</button>
          </td>
        </tr>
      `;
    });

  } catch (err) {
    console.error("Error loading admins:", err);
    alert("Error loading admins. Please check if the server is running.");
  }
}

// Approve/Block admin
async function toggleApproval(adminId) {
  try {
    const res = await fetch(`http://localhost:5000/api/admin/approve/${adminId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update status");

    alert(data.message);
    loadAdmins();
  } catch (err) {
    console.error("Error toggling approval:", err);
    alert("Error updating admin status.");
  }
}

// Delete admin
async function deleteAdmin(adminId) {
  try {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    const res = await fetch(`http://localhost:5000/api/admin/delete/${adminId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete admin");

    alert(data.message);
    loadAdmins();
  } catch (err) {
    console.error("Error deleting admin:", err);
    alert("Error deleting admin.");
  }
}

// Add new admin
async function addAdmin() {
  try {
    const name = document.getElementById('adminName').value.trim();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const department = document.getElementById('adminDept').value.trim();
    const year = document.getElementById('adminYear').value.trim();

    if (!name || !email || !password || !department || !year) {
      alert("Please fill in all fields.");
      return;
    }

    const res = await fetch('http://localhost:5000/api/admin/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, department, year })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to register admin");

    alert(data.message);
    loadAdmins();
  } catch (err) {
    console.error("Error adding admin:", err);
    alert("Error connecting to server.");
  }
}

// Initialize on page load
window.onload = loadAdmins;
