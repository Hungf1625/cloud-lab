const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Đã kết nối mongoose'))
        .catch(err => {
            console.error('Connection failed:', err.message);
            process.exit(1);
        });
};

module.exports = connectDB;