require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('../config/database.js');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/api/hello', (req, res) => {
    console.log(`Server đang hoạt động`);
    res.json({ 
        message: 'Server đang hoạt động',
        status: 'success'
    });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
