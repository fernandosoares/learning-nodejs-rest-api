const dotenv = require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || null;

const validate = require("../middlewares/validate");

const Users = require("../models/Users");

// Get All
router.get("/", validate, async (req, res) => {
  const users = await Users.find();
  res.status(200).json(users);
});

// Create
router.post("/add", async (req, res) => {
  const { name, email, username, password } = req.body;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) return res.status(500).json(err);
    const user = {
      name,
      email,
      username,
      password: hash,
    };

    try {
      await Users.create(user);
      res.status(201).json({
        success: true,
        message: "User was created",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username }).exec();
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return res.status(500).json(err);
      if (!result) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const token = jwt.sign({ username }, SECRET, { expiresIn: "24h" });
      res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
