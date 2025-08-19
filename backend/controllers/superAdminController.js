const SuperAdmin = require('../models/SuperAdmin');

// Register Super Admin
exports.registerSuperAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newAdmin = new SuperAdmin({ name, email, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Super Admin Registered Successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Login Super Admin
exports.loginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await SuperAdmin.findOne({ email, password });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({ message: 'Super Admin Login Successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
