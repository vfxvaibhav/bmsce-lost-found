import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../../utils/api';
import { auth, validateForm } from '../../utils/helpers';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
      email: { required: true, email: true },
      password: { required: true, minLength: 6 }
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.adminLogin(formData);
      const { token, admin } = response.data;
      
      auth.setToken(token);
      auth.setAdmin(admin);
      
      router.push('/admin/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Admin login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: 'var(--primary-green)', 
            textDecoration: 'none' 
          }}>
            BMSCE Lost & Found
          </Link>
          <h2 style={{ marginTop: '16px', marginBottom: '8px' }}>Admin Portal</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Secure administrative access</p>
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
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter admin email"
            />
            {errors.email && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter admin password"
            />
            {errors.password && <span style={{ color: '#ff4757', fontSize: '14px' }}>{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '20px' }}
            disabled={loading}
          >
            {loading ? <div className="spinner" style={{ width: '20px', height: '20px' }}></div> : 'Admin Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link href="/login" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Student Login
          </Link>
        </div>

        {/* Demo Credentials */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: 'var(--glass-bg)', 
          borderRadius: '8px',
          border: '1px solid var(--glass-border)'
        }}>
          <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px', fontSize: '14px' }}>Demo Credentials:</h4>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0' }}>
            Email: admin@bmsce.ac.in
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0' }}>
            Password: admin123
          </p>
        </div>
      </div>
    </div>
  );
}