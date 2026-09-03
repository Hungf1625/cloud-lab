require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Thêm CORS
const app = express();
const connectDB = require('../config/database.js');
const port = process.env.PORT || 5000;
const student = require('../server/models/student.js');

// Middleware
app.use(cors()); // Cho phép React app gọi API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Database
connectDB();

// ============== ROUTES ==============

// Test route
app.get('/api/hello', (req, res) => {
    console.log(`Server đang hoạt động`);
    res.json({ 
        message: 'Server đang hoạt động',
        status: 'success'
    });
});

// GET - Lấy tất cả students
app.get("/api/students", async (req, res) => {
    try {
        const students = await student.find();
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({
            message: 'Lỗi khi lấy dữ liệu từ database',
            error: err.message
        });
    }
});

// GET - Lấy student theo ID
app.get("/api/students/:id", async (req, res) => {
    try {
        const studentData = await student.findById(req.params.id);
        
        if (!studentData) {
            return res.status(404).json({
                message: "Không tồn tại student với id này"
            });
        }
        
        res.status(200).json(studentData);
    } catch (err) {
        res.status(500).json({
            message: 'Lỗi khi lấy dữ liệu student',
            error: err.message
        });
    }
});

// POST - Thêm mới student
app.post("/api/students", async (req, res) => {
    try {
        // Validation cơ bản
        const { studentId, name, email } = req.body;
        
        if (!studentId || !name || !email) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp đầy đủ: studentId, name, email'
            });
        }

        // Kiểm tra studentId đã tồn tại chưa
        const existingStudent = await student.findOne({ studentId });
        if (existingStudent) {
            return res.status(400).json({
                message: `StudentId "${studentId}" đã tồn tại`
            });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingEmail = await student.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: `Email "${email}" đã tồn tại`
            });
        }

        const newStudent = await student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        // Xử lý lỗi duplicate key
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `${field} đã tồn tại trong hệ thống`,
                error: err.message
            });
        }
        
        res.status(500).json({
            message: 'Lỗi khi thêm dữ liệu vào database',
            error: err.message
        });
    }
});

// PUT - Cập nhật student
app.put("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra ID hợp lệ
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "ID không hợp lệ"
            });
        }

        const updateStudent = await student.findByIdAndUpdate(
            id,
            req.body,
            { 
                new: true,  // Trả về document đã update
                runValidators: true // Chạy validation từ schema
            }
        );
        
        if (!updateStudent) {
            return res.status(404).json({
                message: "Không tồn tại student với id này"
            });
        }

        res.status(200).json({
            message: "Cập nhật thành công",
            data: updateStudent
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                message: `${field} đã tồn tại trong hệ thống`,
                error: err.message
            });
        }
        res.status(500).json({
            message: 'Lỗi khi cập nhật dữ liệu',
            error: err.message
        });
    }
});

// DELETE - Xóa student
app.delete("/api/students/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Kiểm tra ID hợp lệ
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                message: "ID không hợp lệ"
            });
        }

        const deletedStudent = await student.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Không tồn tại student với id này"
            });
        }

        res.status(200).json({
            message: "Xóa thành công",
            data: deletedStudent
        });
    } catch (err) {
        res.status(500).json({
            message: 'Lỗi khi xóa student',
            error: err.message
        });
    }
});

// ============== START SERVER ==============
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
    console.log(`📚 API Students: http://localhost:${port}/api/students`);
});