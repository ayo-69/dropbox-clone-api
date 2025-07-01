const express = require("express");
const router = express.Router();
require("dotenv").config();

// JWT and bcrypt for authentication
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// For validation
const {registerSchema, loginSchema} = require("../utils/validation");

const User = require("../models/User");

// GET - /auth/register
router.post("/register", async (req, res) => {
    try {
        // Form validation
        const { error } = registerSchema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            console.error("Validation error:", errorMessage);
            return res.status(400).json({ message: errorMessage });
        }

        const { name, email, password } = req.body;
        console.log("Received registration data:", { name, email, password });
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        newUser.save()
            .then(() => {
                console.log("User registered successfully");
                res.status(201).json({ message: "User registered successfully" });
            })
            .catch((error) => {
                console.error("Error saving user:", error);
                res.status(500).json({ message: "Error saving user" });
            });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST - /auth/login
router.post("/login", async (req, res) => {
    try {
        // Form validation
        const { error } = loginSchema.validate(req.body);
        if (error) {
            const errorMessage = error.details[0].message;
            console.error("Validation error:", errorMessage);
            return res.status(400).json({ message: errorMessage });
        }
        
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({ message: "Invalid request"});
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

module.exports = router;