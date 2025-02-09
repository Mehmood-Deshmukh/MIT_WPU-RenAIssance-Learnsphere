const mongoose = require('mongoose');


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGOURL);

        
        console.log('MongoDB Connected');
        return conn;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

module.exports = { connectDB};