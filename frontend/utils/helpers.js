// Authentication utilities
export const auth = {
  // Get token from localStorage
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  // Set token in localStorage
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  // Remove token from localStorage
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin');
    }
  },

  // Get user from localStorage
  getUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  // Set user in localStorage
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  // Get admin from localStorage
  getAdmin: () => {
    if (typeof window !== 'undefined') {
      const admin = localStorage.getItem('admin');
      return admin ? JSON.parse(admin) : null;
    }
    return null;
  },

  // Set admin in localStorage
  setAdmin: (admin) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin', JSON.stringify(admin));
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!auth.getToken();
  },

  // Check if user is admin
  isAdmin: () => {
    return !!auth.getAdmin();
  },

  // Logout
  logout: () => {
    auth.removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};

// Format date utility
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format relative time
export const formatRelativeTime = (date) => {
  const now = new Date();
  const itemDate = new Date(date);
  const diffInHours = Math.floor((now - itemDate) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
  
  return formatDate(date);
};

// Get status color
export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'pending':
      return 'badge-warning';
    case 'approved':
      return 'badge-success';
    case 'rejected':
      return 'badge-danger';
    case 'resolved':
      return 'badge-success';
    default:
      return 'badge-warning';
  }
};

// Validate form data
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} is required`;
    }
    
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.email && value && !/\S+@\S+\.\S+/.test(value)) {
      errors[field] = 'Please enter a valid email';
    }
    
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};