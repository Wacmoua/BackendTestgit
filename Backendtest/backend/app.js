const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const cors = require("cors");
const dotenv = require("dotenv").config();

// Connexion à la DB
connectDB();

const app = express();

// Middleware CORS
app.use(cors());

// Middleware qui permet de traiter les données de la Request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware de session
app.use(
  session({
    secret: "votre_secret_session",
    resave: true,
    saveUninitialized: true,
  })
);

// Routes
app.use("/post", require("./routes/post.routes"));
app.use("/auth", require("./routes/auth.routes"));

module.exports = app;
