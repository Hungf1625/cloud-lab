const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = () => {
    mongoose.connect("mongodb+srv://hungtranthien1_db_user:0TaFKXRFsE09SVWJ@cluster0.thwce0e.mongodb.net/?appName=Cluster0")
        .then(() => console.log('Đã kết nối mongoose'))
        .catch(err => {
            console.error('Connection failed:', err.message);
            process.exit(1);
        });
};

module.exports = connectDB;