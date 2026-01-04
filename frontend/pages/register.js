import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../utils/api';
import { auth, validateForm } from '../utils/helpers';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    usn: '',
    phone: '',
    department: '',
    year: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science Engineering',
    'Information Science Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Biotechnology',
    'Chemical Engineering'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm(formData, {
      name: { required: true },
      email: { required: true, email: true },
      usn: { required: true },
      phone: { required: true },
      department: { required: true },
      year: { required: true },
      password: { required: true, minLength: 6 }
    });

    // Check BMSCE email domain
    if (formData.email && !formData.email.endsWith('@bmsce.ac.in')) {
      validation.errors.email = 'Please use your BMSCE email address (@bmsce.ac.in)';
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = formData;
      const response = await authAPI.register(submitData);
      const { token, user } = response.data;
      
      auth.setToken(token);
      auth.setUser(user);
      
      router.push('/student/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: 'var(--primary-green)', 
            textDecoration: 'none' 
          }}>
            BMSCE Lost & Found
          </Link>
          <h2 style={{ marginTop: '16px', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Join the BMSCE community</p>
        </div>

        {errors.general && (
          <div style={{ 
            background: 'rgba(255, 71, 87, 0.1)', 
            border: '1px solid #ff4757', 
            borderRadius: '8px', 
            padding: '12px', 
            marginBottom: '20px',
            color: '#ff4757',
            textAlign: 'center'
          }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
              />
              {errors.name && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">USN</label>
              <input
                type="text"
                name="usn"
                value={formData.usn}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 1BM21CS001"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.usn && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.usn}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
            />
            {errors.email && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.email}</span>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter phone number"
              />
              {errors.phone && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              {errors.year && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.year}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.department}</span>}
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Create password"
              />
              {errors.password && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.confirmPassword}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-green)', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}