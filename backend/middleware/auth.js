const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    // Get authorization token from headers
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authentication token is required and must be in the format: Bearer <token>" });
    }

    // Extract the token from the header
    const token = auth.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Attach user
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token"});
    }
}

module.exports = authMiddleware;