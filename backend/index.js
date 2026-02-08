// app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const router = require('./routes');

const app = express();

// --- CORS ---
app.use(cors());
app.options('*', cors()); // handle preflight requests

// Serve frontend product assets
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'src', 'assest', 'products')));

// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api", router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    const status = err?.status || 500;
    res.status(status).json({
        message: err.message || 'Internal Server Error',
        error: true,
        success: false
    });
});

// --- Connect to DB and start server ---
const PORT = process.env.PORT || 8080;

connectDB()
    .then(() => {
        console.log("Connected to DB");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error("Failed to connect to DB:", err);
    });
