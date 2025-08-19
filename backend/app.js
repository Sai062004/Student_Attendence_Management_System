const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Global Middlewares
app.use(cors());
app.use(express.json()); // Parse incoming JSON requests

// ✅ Route Imports
const superAdminRoutes = require('./routes/superAdminRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// ✅ Mount API Routes
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('Attendance Management System is running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
