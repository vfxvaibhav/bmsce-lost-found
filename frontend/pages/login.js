import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { authAPI } from '../utils/api';
import { auth, validateForm } from '../utils/helpers';

export default function Login() {
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
    // Clear error when user starts typing
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

    // Check BMSCE email domain
    if (formData.email && !formData.email.endsWith('@bmsce.ac.in')) {
      validation.errors.email = 'Please use your BMSCE email address (@bmsce.ac.in)';
      validation.isValid = false;
    }

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;
      
      auth.setToken(token);
      auth.setUser(user);
      
      router.push('/student/dashboard');
    } catch (error) {
      setErrors({
        general: error.response?.data?.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 'var(--spacing-lg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(48, 209, 88, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)'
      }}></div>
      
      <div className="glass-card fade-in-up" style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: 'var(--spacing-2xl)',
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
          <Link href="/" style={{ 
            fontSize: '28px', 
            fontWeight: 'var(--font-weight-bold)', 
            color: 'var(--primary-green)', 
            textDecoration: 'none',
            display: 'block',
            marginBottom: 'var(--spacing-lg)'
          }}>
            BMSCE Lost & Found
          </Link>
          <h2 style={{ 
            marginBottom: 'var(--spacing-sm)',
            fontSize: '32px',
            fontWeight: 'var(--font-weight-bold)'
          }}>Welcome Back</h2>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px'
          }}>Sign in to your account</p>
        </div>

        {errors.general && (
          <div style={{ 
            background: 'rgba(255, 71, 87, 0.1)', 
            border: '1px solid #ff4757', 
            borderRadius: 'var(--radius-md)', 
            padding: 'var(--spacing-md)', 
            marginBottom: 'var(--spacing-lg)',
            color: '#ff4757',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              style={{
                fontSize: '16px',
                padding: '18px 20px'
              }}
            />
            {errors.email && (
              <span style={{ 
                color: '#ff4757', 
                fontSize: '12px',
                display: 'block',
                marginTop: 'var(--spacing-xs)'
              }}>
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              style={{
                fontSize: '16px',
                padding: '18px 20px'
              }}
            />
            {errors.password && (
              <span style={{ 
                color: '#ff4757', 
                fontSize: '12px',
                display: 'block',
                marginTop: 'var(--spacing-xs)'
              }}>
                {errors.password}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large" 
            style={{ 
              width: '100%', 
              marginBottom: 'var(--spacing-xl)',
              fontSize: '16px',
              fontWeight: 'var(--font-weight-semibold)'
            }}
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            marginBottom: 'var(--spacing-md)',
            fontSize: '14px'
          }}>
            Don't have an account?{' '}
            <Link href="/register" style={{ 
              color: 'var(--primary-green)', 
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Sign up
            </Link>
          </p>
          <Link href="/admin/login" style={{ 
            color: 'var(--primary-green)', 
            textDecoration: 'none', 
            fontSize: '14px',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}