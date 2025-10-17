import User from "../models/user.js"
import Blog from "../models/blog.js"
import jwt from "jsonwebtoken"
import _ from "lodash"
import { expressjwt } from "express-jwt"
import "dotenv/config.js";
import { errorHandler } from "../helpers/dbErrorHandler.js"
import sgMail from "@sendgrid/mail"
import nodemailer from 'nodemailer';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

export const preSignup = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is taken' });
        }

        const token = jwt.sign(
            { name, username, email, password },
            process.env.JWT_ACCOUNT_ACTIVATION,
            { expiresIn: '10m' }
        );



        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Account activation link',
            html: `
                <p>Please use the following link to activate your account:</p>
                <p>${process.env.MAIN_URL}/auth/account/activate/${token}</p>
                <hr />
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
        });

    } catch (err) {
    console.error("🔥 preSignup error:", err);

    const fallbackError =
        err && err.message
            ? err.message
            : "Something went wrong during pre-signup";

    res.status(400).json({
        error: fallbackError
    });
}

}

export const signup = async user => {
  try {
    const response = await fetch(`${API}/account-activate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const text = await response.text();
console.log("📡 Calling API:", `${API}/account-activate`);

    // Try parsing only if it looks like JSON
    if (text.trim().startsWith('<!DOCTYPE')) {
      throw new Error("Received HTML instead of JSON. Likely wrong API endpoint.");
    }

    const json = JSON.parse(text);
    if (!response.ok) throw new Error(json.error || 'Activation failed.');
    return json;

  } catch (err) {
    console.error("❌ Signup error:", err.message);
    return { error: err.message || "Activation failed. Try again." };
  }
};




export const signin = async (req, res) => {
    const { password } = req.body;
       try {
        const user = await User.findOne({ email: req.body.email }).exec();
        

        if (!user) { return res.status(400).json({ error: 'User with that email does not exist. Please sign up.' }); }
        if (!user.authenticate(password)) { return res.status(400).json({ error: 'Email and password do not match.' }); }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '100d' });
        res.cookie('token', token, { expiresIn: '1d' });
        const { _id, username, name, email, role } = user;
        res.json({ token, user: { _id, username, name, email, role } });
    } catch (err) { return res.status(400).json({ error: err}); }
};




export const signout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Signout success' });
};


export const requireSignin = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});



export const authMiddleware = async (req, res, next) => {
    try {
        const authUserId = req.auth._id;
        const user = await User.findById({ _id: authUserId }).exec();

        if (!user) { return res.status(400).json({ error: 'User not found' }); }
        req.profile = user;
        next();
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};



export const adminMiddleware = async (req, res, next) => {
    try {
        const adminUserId = req.auth._id;
        const user = await User.findById({ _id: adminUserId }).exec();
        if (!user) { return res.status(400).json({ error: 'User not found' }); }
        if (user.role !== 1) { return res.status(400).json({ error: 'Admin resource. Access denied' }); }
        req.profile = user;
        next();
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};



export const canUpdateDeleteBlog = async (req, res, next) => {
    try {
        const slug = req.params.slug.toLowerCase();
        const data = await Blog.findOne({ slug }).exec();

        if (!data) { return res.status(400).json({ error: errorHandler(err) }); }
        const authorizedUser = data.postedBy._id.toString() === req.profile._id.toString();

        if (!authorizedUser) { return res.status(400).json({ error: 'You are not authorized' }); }
        next();
    } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
};


/*
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ error: 'User with that email does not exist' }); }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password reset link',
            html: `
            <p>Please use the following link to reset your password:</p>
            <p>${process.env.MAIN_URL}/auth/password/reset/${token}</p>
            <hr />
            <p>This email may contain sensitive information</p>
            <p>${process.env.MAIN_URL}</p>
            `
        };
        await user.updateOne({ resetPasswordLink: token });
        await sgMail.send(emailData);
        res.json({ message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.` });
    } catch (err) { res.json({ error: errorHandler(err) }); }
};
*/


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User with that email does not exist' });
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_RESET_PASSWORD,
            { expiresIn: '10m' }
        );

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password reset link',
            html: `
                <p>Please use the following link to reset your password:</p>
                <p>${process.env.MAIN_URL}/auth/password/reset/${token}</p>
                <hr />
                <p>This email may contain sensitive information</p>
                <p>${process.env.MAIN_URL}</p>
            `
        };

        await user.updateOne({ resetPasswordLink: token });
        await transporter.sendMail(mailOptions);

        res.json({
            message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10 minutes.`
        });

    } catch (err) {
        console.log(err);
        res.status(400).json({ error: errorHandler(err) });
    }
};


export const resetPassword = async (req, res) => {
    const { resetPasswordLink, newPassword } = req.body;
    if (resetPasswordLink) {
        try {
            const decoded = jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD);
            if (decoded) {
                const user = await User.findOne({ resetPasswordLink });

                if (!user) { return res.status(401).json({ error: 'Something went wrong. Try later' }); }
                const updatedFields = { password: newPassword, resetPasswordLink: '' };
                user.set(updatedFields);
                await user.save();

                res.json({ message: 'Great! Now you can login with your new password' });
            } else { return res.status(401).json({ error: 'Expired link. Try again' }); }
        } catch (err) { res.status(400).json({ error: errorHandler(err) }); }
    }
};

export const activateAccount = async (req, res) => {
  try {
    const { token } = req.body;  // or maybe via `req.params` or `req.query`
    if (!token) {
      return res.status(400).json({ error: "No activation token provided" });
    }

    // Verify the token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const { name, username, email, password } = payload;

    // Check again: maybe the user already exists / already activated
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ error: "User already exists or already activated" });
    }

    // Hash password before storing
    const hashed = await hashPassword(password);  // use bcrypt / argon2 etc.

    // Create the user in DB
    user = new User({
      name,
      username,
      email: email.toLowerCase(),
      password: hashed,
      isActivated: true,       // or some "active" field
      activatedAt: new Date(), // optional
    });

    await user.save();

    // Optionally, you could issue a login token now
    const authToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: "Account activated successfully",
      token: authToken,
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      }
    });
  } catch (err) {
    console.error("🔥 activateAccount error:", err);
    res.status(500).json({ error: "Server error during account activation" });
  }
};
