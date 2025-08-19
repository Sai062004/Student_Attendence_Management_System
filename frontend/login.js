async function login() {
  const role = document.getElementById('role').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const status = document.getElementById('loginStatus');

  const url =
    role === 'superadmin'
      ? 'http://localhost:5000/api/superadmin/login'
      : 'http://localhost:5000/api/admin/login';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      status.style.color = 'green';
      status.textContent = `${role} login successful! Redirecting...`;

      // ✅ Redirect after login (adjust these paths if needed)
      setTimeout(() => {
        if (role === 'superadmin') {
          window.location.href = './superadmin.html';
        } else {
          window.location.href = './admin/admin.html'; // ✅ this will work now
        }
      }, 1000);
    } else {
      status.style.color = 'red';
      status.textContent = data.error || 'Login failed';
    }
  } catch (error) {
    status.style.color = 'red';
    status.textContent = 'Server error. Please try again.';
    console.error('Login error:', error);
  }
}
