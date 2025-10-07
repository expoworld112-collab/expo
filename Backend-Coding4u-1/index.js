
// import express from "express";
// import morgan from "morgan";
// import bodyParser from "body-parser";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import mongoose from "mongoose";
// import session from "express-session";
// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth2";
// import jwt from "jsonwebtoken";
// import "dotenv/config.js";

// // Models & Config
// import User from "./models/user.js";
// import { FRONTEND } from "./config.js";

// // Route imports
// import blogRoutes from "./routes/blog.js";
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/user.js";
// import categoryRoutes from "./routes/category.js";
// import tagRoutes from "./routes/tag.js";
// import formRoutes from "./routes/form.js";
// import imageRoutes from "./routes/images.js";
// import storyRoutes from "./routes/slides.js";

// const app = express();

// //
// // ✅ Global Request Logger (for debugging)
// //
// app.use((req, res, next) => {
//   console.log(`➡️  ${req.method} ${req.originalUrl}`);
//   next();
// });

// //
// // ✅ Robust CORS Setup
// //
// const allowedOrigins = [
//   "http://localhost:3000",
//   FRONTEND,
//   "https://coding4u-frontend.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // allow curl/Postman

//     if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
//       console.log("✅ CORS allowed for:", origin);
//       callback(null, true);
//     } else {
//       console.warn("❌ CORS blocked for:", origin);
//       callback(new Error("Not allowed by CORS: " + origin));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
// }));

// // Allow preflight
// app.options("*", cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

// //
// // ✅ MongoDB Connection
// //
// mongoose.set("strictQuery", true);
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch(err => console.error("❌ MongoDB Error:", err));

// //
// // ✅ Middleware
// //
// app.use(morgan("dev"));
// app.use(bodyParser.json());
// app.use(cookieParser());

// // Handle /favicon.ico
// app.get("/favicon.ico", (req, res) => res.sendStatus(204));

// //
// // ✅ Session
// //
// app.use(session({
//   secret: process.env.GOOGLE_CLIENT_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: process.env.NODE_ENV === "production",
//     sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
//     httpOnly: true,
//   },
// }));

// //
// // ✅ Passport Setup
// //
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback",
//   scope: ["profile", "email"],
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     const user = await User.findOne(
//       { email: profile.emails[0].value },
//       "email username name profile role"
//     );
//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => done(null, user));
// passport.deserializeUser((user, done) => done(null, user));

// //
// // ✅ API Routes
// //
// app.use("/api", blogRoutes);
// app.use("/api", authRoutes);
// app.use("/api", userRoutes);
// app.use("/api", categoryRoutes);
// app.use("/api", tagRoutes);
// app.use("/api", formRoutes);
// app.use("/api", imageRoutes);
// app.use("/api", storyRoutes);

// //
// // ✅ Test route
// //
// app.get("/", (req, res) => {
//   res.json("✅ Backend is live");
// });

// //
// // ✅ Google OAuth routes
// //
// app.get("/auth/google", passport.authenticate("google", {
//   scope: ["profile", "email"]
// }));

// app.get("/auth/google/callback", passport.authenticate("google", {
//   successRedirect: FRONTEND,
//   failureRedirect: `${FRONTEND}/signin`,
// }));

// app.get("/login/success", (req, res) => {
//   if (req.user) {
//     const token = jwt.sign(
//       { _id: req.user._id },
//       process.env.JWT_SECRET,
//       { expiresIn: "10d" }
//     );
//     return res.status(200).json({ user: req.user, token });
//   }
//   return res.status(401).json({ message: "Not authorized" });
// });

// app.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     res.redirect(`${FRONTEND}/signin`);
//   });
// });

// //
// // ✅ CORS Error Handler (Optional)
// //
// app.use((err, req, res, next) => {
//   if (err.message && err.message.includes("Not allowed by CORS")) {
//     return res.status(403).json({ message: err.message });
//   }
//   next(err);
// });

// //
// // ✅ Start server in local dev
// //
// const port = process.env.PORT || 8000;
// if (process.env.NODE_ENV !== "production") {
//   app.listen(port, () => {
//     console.log(`🚀 Server running at http://localhost:${port}`);
//   });
// }

// //
// // ✅ Export for Vercel
// //
// export default app;
import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import jwt from "jsonwebtoken";
import "dotenv/config.js";

// Models & Config
import User from "./models/user.js";
import { FRONTEND } from "./config.js";

// Route imports
import blogRoutes from "./routes/blog.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import tagRoutes from "./routes/tag.js";
import formRoutes from "./routes/form.js";
import imageRoutes from "./routes/images.js";
import storyRoutes from "./routes/slides.js";

const app = express();

//
// ✅ Debug logger
//
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  next();
});

//
// ✅ CORS
//
const allowedOrigins = [
  "http://localhost:3000",
  FRONTEND,
  "https://coding4u-frontend.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow non-browser requests (e.g., Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      console.log("✅ CORS allowed for:", origin);
      return callback(null, true);
    } else {
      console.warn("❌ CORS blocked for:", origin);
      return callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Allow all OPTIONS requests for preflight
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

//
// ✅ MongoDB
//
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

//
// ✅ Middleware
//
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// Handle favicon
app.get("/favicon.ico", (req, res) => res.sendStatus(204));

//
// ✅ Sessions
//
app.use(session({
  secret: process.env.GOOGLE_CLIENT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    httpOnly: true,
  },
}));

//
// ✅ Passport
//
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback",
  scope: ["profile", "email"],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne(
      { email: profile.emails[0].value },
      "email username name profile role"
    );
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

//
// ✅ API Routes
//
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", tagRoutes);
app.use("/api", formRoutes);
app.use("/api", imageRoutes);
app.use("/api", storyRoutes);

//
// ✅ Test root
//
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend is live" });
});

//
// ✅ OAuth Routes
//
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: FRONTEND,
  failureRedirect: `${FRONTEND}/signin`,
}));

app.get("/login/success", (req, res) => {
  if (req.user) {
    const token = jwt.sign(
      { _id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );
    return res.status(200).json({ user: req.user, token });
  }
  return res.status(401).json({ message: "Not authorized" });
});

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect(`${FRONTEND}/signin`);
  });
});

//
// ✅ CORS Error Handler
//
app.use((err, req, res, next) => {
  if (err.message && err.message.includes("Not allowed by CORS")) {
    return res.status(403).json({ message: err.message });
  }
  next(err);
});

//
// ✅ Start Local Server (for dev)
//
const port = process.env.PORT || 8000;
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`🚀 Dev server running at http://localhost:${port}`);
  });
}

//
// ✅ Export for Vercel or Serverless
//
export default app;
