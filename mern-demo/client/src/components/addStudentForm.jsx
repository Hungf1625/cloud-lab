import React, { useState } from 'react';

const AddStudentForm = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng nhập
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.studentId || !formData.name || !formData.email) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    setError('');

    const result = await onAddStudent(formData);
    
    if (result.success) {
      // Reset form
      setFormData({ studentId: '', name: '', email: '' });
      alert('Thêm sinh viên thành công!');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="add-student-form">
      <h2>➕ Thêm sinh viên mới</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Mã sinh viên:</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="VD: SV001"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Họ tên:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="VD: Nguyễn Văn A"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="VD: example@email.com"
            disabled={loading}
          />
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Đang thêm...' : 'Thêm sinh viên'}
        </button>
      </form>
    </div>
  );
};

export default AddStudentForm;