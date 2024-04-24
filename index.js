import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
dotenv.config();

import { fileURLToPath } from "url";
import path from "path";

const app = express();
const port = 4000;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("Connected to Database");
  } catch (e) {
    console.log("Problem connecting to Database", e);
  }
};
connectToDatabase();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const sessionObject = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionObject));

import User from "./models/users.js";

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Login route - POST
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = undefined;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    console.log("Problem finding user");
  }

  if (user.password === password) {
    // Store user ID in session
    req.session.userId = user.id;
    req.session.email = user.email;
    req.session.username = user.username;
    req.session.role = user.role;
    res.redirect("/");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
});

// const User = require("./models/user");
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Username or email already exists." });
  }

  // Create a new user
  const newUser = new User({
    username,
    email,
    password, // For simplicity, we're storing the password directly
  });

  // Save the new user to the database
  newUser
    .save()
    .then(() => {
      // Optionally, you can handle additional logic like sending a confirmation email, etc.
      res.redirect("/login");
    })
    .catch((error) => {
      // Handle any errors that occur during user creation
      console.error("Error creating user:", error);
      res.status(500).json({ error: "An unexpected error occurred." });
    });
});

app.get("/", (req, res) => {
  const { username, email, role } = req.session;
  res.render("index", { username, email, role });
});

app.get("/data/:dataId", (req, res) => {
  const { dataId } = req.params;
  res.render("data", { dataId });
});

app.get("/logout", (req, res) => {
  // Clear the user's session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    // Redirect the user to the login page or any other appropriate page after logout
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
