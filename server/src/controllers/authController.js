const AdminUser = require("../models/AdminUser");
const generateToken = require("../utils/generateToken");

// POST /api/auth/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(admin._id);

    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//POST /api/auth/register
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await AdminUser.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const admin = await AdminUser.create({ email, password });

    const token = generateToken(admin._id); // <-- needs JWT_SECRET set!

    return res.status(201).json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("registerAdmin error:", err); // 👈 log full error to terminal
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // basic validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const exists = await User.findOne({ email });
//     if (exists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const user = await User.create({ name, email, password });

//     const token = generateToken(user._id); // <-- needs JWT_SECRET set!

//     return res.status(201).json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("registerUser error:", err); // 👈 log full error to terminal
//     return res.status(500).json({ message: err.message || "Server error" });
//   }
// };
module.exports = { loginAdmin, registerAdmin };
