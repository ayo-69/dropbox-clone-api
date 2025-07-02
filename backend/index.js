const express = require("express");
const app = express();

require("dotenv").config();

// Connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ Mongoose connection error:', err));

// Middleware to handle CORS
const cors = require("cors");
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} -- '${req.url}'`);
    next(); 
});

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/files", require("./routes/files"));

// To test the auth middleware
app.use("/secure", require("./routes/test"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});