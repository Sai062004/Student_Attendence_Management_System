const Admin = require('../models/Admin');

// Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, department, year } = req.body;
    const newAdmin = new Admin({
      name,
      email,
      password,
      department,
      year,
      approved: false,
      isBlocked: false
    });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin Registered Successfully. Wait for Super Admin approval.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    console.log("Requested Email:", email);
    console.log("Admin from DB:", admin);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (!admin.approved) {
      console.log("Admin is not approved");
      return res.status(403).json({ error: "Admin not approved yet" });
    }

    if (admin.isBlocked) {
      console.log("Admin is blocked");
      return res.status(403).json({ error: "Admin is blocked" });
    }

    if (admin.password !== password) {
      console.log("Wrong password entered");
      return res.status(401).json({ error: "Invalid password" });
    }

    console.log("Login successful for", email);
    res.status(200).json({ message: "Login successful", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve or Block Admin Toggle
exports.approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Toggle approved
    admin.approved = !admin.approved;

    // If approved is true, unblock; if false, block
    admin.isBlocked = !admin.approved;

    await admin.save();

    res.json({
      message: `Admin ${admin.approved ? 'approved' : 'blocked'} successfully`
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Block Admin (Optional - for separate route)
exports.blockAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: 'Admin not found' });

    admin.isBlocked = true;
    await admin.save();

    res.json({ message: 'Admin blocked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
