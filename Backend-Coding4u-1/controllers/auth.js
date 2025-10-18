import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import expressJwt from "express-jwt";
import { requireSignin } from '../controllers/auth.js';

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

// Middleware for validating signup input
export const validateSignup = [
  body("name").trim().notEmpty().withMessage("Name required"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters")
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username format invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map((e) => e.msg) });
    }
    next();
  },
];

// Protect routes - middleware that verifies JWT token
export const requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

// Pre-signup: sends activation email with token
export const preSignup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const lowerEmail = email.toLowerCase();
    const existing = await User.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Hash password here to store in token (optional, but recommended)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create short-lived activation token including hashed password
    const payload = { name, username, email: lowerEmail, passwordHash };
    const token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m",
    });

    const activationLink = `${process.env.MAIN_URL}/auth/account/activate/${token}`;
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: lowerEmail,
      subject: "Activate your account",
      html: `
        <p>Please click the link below to activate your account:</p>
        <p><a href="${activationLink}">${activationLink}</a></p>
        <hr/>
        <p>This link expires in 10 minutes</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: `Activation email sent to ${lowerEmail}` });
  } catch (err) {
    console.error("🔥 preSignup error:", err);
    return res.status(500).json({ error: "Error in preSignup. Try again later." });
  }
};

// Activate account from token
export const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { name, username, email, passwordHash } = payload;

    const lowerEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      return res.status(400).json({ error: "Account already exists. Please sign in." });
    }

    if (!passwordHash) {
      return res.status(400).json({ error: "Password information missing. Activation failed." });
    }

    const user = new User({
      name,
      username,
      email: lowerEmail,
      password: passwordHash,
      isActivated: true,
      activatedAt: new Date(),
    });

    await user.save();

    // Issue login token:
    const authToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Account activated successfully",
      token: authToken,
      user: { name: user.name, email: user.email, username: user.username },
    });
  } catch (err) {
    console.error("🔥 activateAccount error:", err);
    return res.status(500).json({ error: "Activation failed. Try later." });
  }
};

// Signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();

    const user = await User.findOne({ email: lowerEmail }).exec();
    if (!user) {
      return res.status(400).json({ error: "User with that email does not exist. Please sign up." });
    }

    if (!user.isActivated) {
      return res.status(400).json({ error: "Account not activated yet." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email and password do not match." });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    const { _id, username, name, role } = user;
    return res.json({ token, user: { _id, username, name, email: lowerEmail, role } });
  } catch (err) {
    console.error("🔥 signin error:", err);
    return res.status(500).json({ error: "Signin failed. Try again." });
  }
};

// Signout
export const signout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout successful" });
};

// Auth middleware to get user profile
export const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.auth._id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    req.profile = user;
    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(500).json({ error: "Could not authenticate user" });
  }
};

// Admin middleware to allow only admins
export const adminMiddleware = async (req, res, next) => {
  try {
    const userId = req.auth._id;
    const user = await User.findById(userId).exec();
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Admin resource. Access denied." });
    }
    req.profile = user;
    next();
  } catch (err) {
    console.error("adminMiddleware error:", err);
    return res.status(500).json({ error: "Admin check failed" });
  }
};

// Password reset functions can go here too, if needed...

