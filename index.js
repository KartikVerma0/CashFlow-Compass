import authRouter from "./routes/auth.js";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";

dotenv.config();


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

app.use("/", authRouter)

app.get("/", (req, res) => {
  const { username, email, role } = req.session;
  res.render("index/index", { username, email, role });
});

app.get("/dashboard", (req, res) => {
  const { username, email, role } = req.session;
  res.render("dashboard/dashboard", { username, email, role });
});

app.get("/data/:dataId", (req, res) => {
  const { dataId } = req.params;
  res.render("data/data", { dataId });
});




//profile page route
app.get("/profile", async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      // If not authenticated, redirect to login page
      return res.redirect("/login");
    }

    // Fetch user data from the database based on the stored user ID
    const user = await User.findById(req.session.userId);

    // If user not found, handle error
    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    // Render the profile page with user data
    res.render("profile", { user });
  } catch (error) {
    console.error("Error rendering profile page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
