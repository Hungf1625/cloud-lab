import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import StudentList from './components/studentsList';
import AddStudentForm from './components/addStudentForm';

const API_URL = '/api/students';

function App() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Lấy danh sách sinh viên
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(API_URL);
            setStudents(response.data);
        } catch (err) {
            setError('Không thể tải danh sách sinh viên');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Thêm sinh viên mới
    const addStudent = async (studentData) => {
        try {
            const response = await axios.post(API_URL, studentData);
            setStudents([...students, response.data]);
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi thêm sinh viên';
            return { success: false, error: errorMessage };
        }
    };

    // Cập nhật sinh viên
    const updateStudent = async (id, studentData) => {
        try {
            const response = await axios.put(`${API_URL}/${id}`, studentData);
            // Cập nhật trong state
            setStudents(students.map(student => 
                student._id === id ? response.data.data : student
            ));
            return { success: true, data: response.data };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi cập nhật sinh viên';
            return { success: false, error: errorMessage };
        }
    };

    // Xóa sinh viên
    const deleteStudent = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setStudents(students.filter(student => student._id !== id));
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Lỗi khi xóa sinh viên';
            return { success: false, error: errorMessage };
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <div className="app">
            <h1>📚 Quản lý Sinh viên</h1>
            
            <AddStudentForm onAddStudent={addStudent} />
            
            {error && <div className="error">{error}</div>}
            
            <StudentList 
                students={students} 
                loading={loading}
                onDeleteStudent={deleteStudent}
                onUpdateStudent={updateStudent}  // Thêm prop này
            />
        </div>
    );
}

export default App;