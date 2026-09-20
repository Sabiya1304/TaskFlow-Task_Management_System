const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connecting to local MongoDB instance
        const conn = await mongoose.connect('mongodb://localhost:27017/taskManagerDB');
        console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Connection Error: ${error.message}`);
        process.exit(1); // Stop the server if the connection fails
    }
};

module.exports = connectDB;
