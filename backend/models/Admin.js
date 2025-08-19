const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    department: String,
    year: String,
    isBlocked: { type: Boolean, default: false },
    approvedBySuperAdmin: { type: Boolean, default: false },
    role: { type: String, default: 'admin' },
});

module.exports = mongoose.model('Admin', adminSchema);
