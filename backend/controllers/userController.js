import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// 🔐 Create JWT token
const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🟢 Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 🟢 Register User
const registerUser = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await new userModel({ name, email, password: hashPassword }).save();
    const token = createToken(user._id);

    res.json({ success: true, token });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { loginUser, registerUser };
