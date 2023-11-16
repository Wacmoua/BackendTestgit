// post.routes.js
const express = require("express");
const cors = require("cors");
const {
  setPosts,
  getPosts,
  editPost,
  deletePost,
  likePost,
  dislikePost,
} = require("../controllers/post.controller");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const router = express.Router();

// Middleware CORS - Ajoutez-le au début
router.use(cors());

// Route d'enregistrement d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà." });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({ message: "Utilisateur enregistré avec succès.", user: newUser });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Route de connexion de l'utilisateur
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifiez si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifiez le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Ici, vous pouvez générer un jeton d'authentification si nécessaire
    // et le renvoyer au client.

    res.status(200).json({ message: "Connexion réussie.", user });
  } catch (error) {
    console.error("Erreur lors de la connexion de l'utilisateur :", error);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Routes pour les posts
router.get("/", getPosts);
router.post("/", setPosts);
router.put("/:id", editPost);
router.delete("/:id", deletePost);
router.patch("/like-post/:id", likePost);
router.patch("/dislike-post/:id", dislikePost);

module.exports = router;

