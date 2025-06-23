const express = require("express");
const router = express.Router();

// GET - /auth/register
router.get("/register", (req, res) => {
    res.send("Hello Favour")
})

module.exports = router