import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import nodemailer from "nodemailer";
import { body, validationResult } from "express-validator";
import { errorHandler } from "../helpers/dbErrorHandler.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  tls: { rejectUnauthorized: false },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
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
    .matches(/^[A-Za-z0-9_]+$/).withMessage("Username format invalid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => e.msg) });
    }
    next();
  }
];

export const preSignup = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const lowerEmail = email.toLowerCase();
    const existing = await User.findOne({ email: lowerEmail });
    if (existing) {
      return res.status(400).json({ error: "Email is already taken" });
    }

    // Create a short-lived activation token (without password)
    const payload = { name, username, email: lowerEmail };
    const token = jwt.sign(payload, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: "10m"
    });

    // **Persist a “pending activation” record** — optional but recommended
    // Example:
    // await PendingActivation.create({ email: lowerEmail, token });

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
      `
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: `Activation email sent to ${lowerEmail}` });
  } catch (err) {
    console.error("🔥 preSignup error:", err);
    return res.status(500).json({ error: "Error in preSignup. Try again later." });
  }
};

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

    const { name, username, email } = payload;

    const lowerEmail = email.toLowerCase();

    // Check if already activated / existing
    const userExists = await User.findOne({ email: lowerEmail });
    if (userExists) {
      return res.status(400).json({ error: "Account already exists. Please sign in." });
    }

    const passwordHash = payload.passwordHash; // hypothetical
    if (!passwordHash) {
      return res
        .status(400)
        .json({ error: "Password information missing. Activation failed." });
    }

    const user = new User({
      name,
      username,
      email: lowerEmail,
      password: passwordHash,
      isActivated: true,
      activatedAt: new Date()
    });
    await user.save();

    // Optionally delete pending activation record

    // Issue login token:
    const authToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Account activated successfully",
      token: authToken,
      user: { name: user.name, email: user.email, username: user.username }
    });
  } catch (err) {
    console.error("🔥 activateAccount error:", err);
    return res.status(500).json({ error: "Activation failed. Try later." });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowerEmail }).exec();
    if (!user) {
      return res
        .status(400)
        .json({ error: "User with that email does not exist. Please sign up." });
    }
    // Check if user is activated
    if (!user.isActivated) {
      return res.status(400).json({ error: "Account not activated yet." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email and password do not match." });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 3600 * 1000
    });
    const { _id, username, name, role } = user;
    return res.json({ token, user: { _id, username, name, email: lowerEmail, role } });
  } catch (err) {
    console.error("🔥 signin error:", err);
    return res.status(500).json({ error: "Signin failed. Try again." });
  }
};
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

// Check if user is admin
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

// Check if user can update/delete a blog (example logic)
export const canUpdateDeleteBlog = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id.toString() === req.auth._id;
  if (!authorized) {
    return res.status(403).json({ error: "User not authorized" });
  }
  next();
};


// ... signout, requireSignin, authMiddleware, adminMiddleware remain largely similar
