const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

// Person Model
const Person = require("../models/Person");

const authorize = (req, res, next) => {
  const token = req.headers["x-access-token"];
  jwt.verify(token, "secret123", (err, decoded) => {
    if (err) return res.status(401).end();

    req.user = decoded.user;
    next();
  });
};

router.get("/do/auth", (req, res) => {
  const { user, pass } = req.body;
  if (user == 123 && pass == 456) {
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60,
    });

    res.json({ auth: true, token });
  }
});

// Create Person
router.post("/", async (req, res) => {
  const { name, salary, approved } = req.body;

  if (!name && !salary && !approved) {
    res.status(422).json({
      error: "We need the name to create a person",
    });
  }

  const person = {
    name,
    salary,
    approved,
  };

  try {
    await Person.create(person);
    res.status(201).json({
      message: "Person was created",
    });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
});

// Get All
router.get("/", authorize, async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Get One
router.get("/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const person = await Person.findById({ _id });
    if (!person) {
      res.status(424).json({ message: "No person was found" });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Update
router.patch("/:id", async (req, res) => {
  const _id = req.params.id;

  try {
    const update = await Person.updateOne({ _id }, { ...req.body });
    res.status(200).json({ update });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  const _id = req.params.id;
  const person = await Person.findOne({ _id });

  console.log(person);

  if (!person) {
    res.status(500).json({ message: "Person not found" });
  }

  try {
    const remove = await Person.deleteOne({ _id });

    if (!remove) {
      res.status(500).json({ message: "Somethig went wrong" });
    }

    res.status(200).json({ message: "Person was removed" });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
