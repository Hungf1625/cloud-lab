import React, { useState } from 'react';

const StudentList = ({ students, loading, onDeleteStudent, onUpdateStudent }) => {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        studentId: '',
        name: '',
        email: ''
    });

    // Bắt đầu chỉnh sửa
    const handleEdit = (student) => {
        setEditingId(student._id);
        setEditData({
            studentId: student.studentId,
            name: student.name,
            email: student.email
        });
    };

    // Hủy chỉnh sửa
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditData({ studentId: '', name: '', email: '' });
    };

    // Xử lý thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Lưu chỉnh sửa
    const handleSaveEdit = async (id) => {
        // Validate
        if (!editData.studentId || !editData.name || !editData.email) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editData.email)) {
            alert('Email không hợp lệ');
            return;
        }

        const result = await onUpdateStudent(id, editData);
        
        if (result.success) {
            setEditingId(null);
            setEditData({ studentId: '', name: '', email: '' });
        } else {
            alert(result.error);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (students.length === 0) {
        return <div className="empty">Chưa có sinh viên nào</div>;
    }

    return (
        <div className="student-list">
            <h2>Danh sách sinh viên ({students.length})</h2>
            
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Mã sinh viên</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student, index) => (
                        <tr key={student._id || student.studentId}>
                            <td>{index + 1}</td>
                            
                            {editingId === student._id ? (
                                // Mode chỉnh sửa
                                <>
                                    <td>
                                        <input
                                            type="text"
                                            name="studentId"
                                            value={editData.studentId}
                                            onChange={handleChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            name="name"
                                            value={editData.name}
                                            onChange={handleChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="email"
                                            name="email"
                                            value={editData.email}
                                            onChange={handleChange}
                                            className="edit-input"
                                        />
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button 
                                                className="btn-save"
                                                onClick={() => handleSaveEdit(student._id)}
                                            >
                                                💾 Lưu
                                            </button>
                                            <button 
                                                className="btn-cancel"
                                                onClick={handleCancelEdit}
                                            >
                                                ❌ Hủy
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                // Mode hiển thị
                                <>
                                    <td><strong>{student.studentId}</strong></td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <div className="action-buttons" style={{ display: 'flex', gap: '10px' }}>
                                            <button 
                                                className="btn-edit"
                                                onClick={() => handleEdit(student)}
                                            >
                                                ✏️ Sửa
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={() => {
                                                    if (window.confirm(`Bạn có chắc muốn xóa sinh viên "${student.name}"?`)) {
                                                        onDeleteStudent(student._id);
                                                    }
                                                }}
                                            >
                                                🗑️ Xóa
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StudentList;