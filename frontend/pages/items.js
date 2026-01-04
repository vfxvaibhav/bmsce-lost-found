import { useState, useEffect } from 'react';
import Link from 'next/link';
import { itemsAPI } from '../utils/api';
import { auth, formatRelativeTime, getStatusColor } from '../utils/helpers';

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  const categories = [
    'Electronics', 'Books', 'Clothing', 'Accessories', 
    'Documents', 'Sports', 'Others'
  ];

  useEffect(() => {
    fetchItems();
  }, [filters]);

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, page, limit: 12 };
      const response = await itemsAPI.getAll(params);
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClaim = (lostItemId, foundItemId) => {
    if (!auth.isAuthenticated()) {
      alert('Please login to make a claim');
      return;
    }
    // Navigate to claim page or open modal
    console.log('Claiming items:', lostItemId, foundItemId);
  };

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">BMSCE Lost & Found</Link>
          <ul className="nav-links">
            {auth.isAuthenticated() ? (
              <>
                <li><Link href="/student/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link href="/items" className="nav-link">Browse Items</Link></li>
                <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Logout</button></li>
              </>
            ) : (
              <>
                <li><Link href="/login" className="nav-link">Login</Link></li>
                <li><Link href="/register" className="nav-link">Register</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>
            Browse Lost & Found Items
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Help reunite items with their owners
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-input"
              >
                <option value="">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="form-input"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-input"
                placeholder="Search items..."
              />
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-3" style={{ marginBottom: '32px' }}>
              {items.map(item => (
                <div key={item._id} className="glass-card" style={{ 
                  padding: 'var(--spacing-lg)', 
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer'
                }}>
                  {/* Item Image */}
                  <div style={{ 
                    width: '100%', 
                    height: '220px', 
                    background: 'linear-gradient(135deg, var(--glass-bg) 0%, rgba(48, 209, 88, 0.05) 100%)', 
                    borderRadius: 'var(--radius-md)', 
                    marginBottom: 'var(--spacing-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {item.image ? (
                      <img 
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover', 
                          borderRadius: 'var(--radius-md)'
                        }}
                      />
                    ) : (
                      <div style={{
                        filter: 'drop-shadow(0 4px 8px rgba(48, 209, 88, 0.3))'
                      }}>
                        {item.type === 'lost' ? '📱' : '🔍'}
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div style={{
                      position: 'absolute',
                      top: 'var(--spacing-md)',
                      right: 'var(--spacing-md)',
                      padding: '6px 12px',
                      background: item.type === 'lost' ? 'rgba(255, 71, 87, 0.9)' : 'rgba(48, 209, 88, 0.9)',
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'var(--font-weight-semibold)',
                      textTransform: 'uppercase',
                      backdropFilter: 'blur(10px)'
                    }}>
                      {item.type}
                    </div>
                  </div>

                  {/* Item Details */}
                  <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      marginBottom: 'var(--spacing-sm)' 
                    }}>
                      <h3 className="card-title" style={{ 
                        fontSize: '18px',
                        lineHeight: '1.3',
                        flex: 1
                      }}>
                        {item.title}
                      </h3>
                      <span className={`badge ${getStatusColor(item.status)}`} style={{
                        marginLeft: 'var(--spacing-sm)',
                        flexShrink: 0
                      }}>
                        {item.status}
                      </span>
                    </div>
                    
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '14px', 
                      marginBottom: 'var(--spacing-md)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: '1.4'
                    }}>
                      {item.description}
                    </p>

                    <div style={{ 
                      fontSize: '12px', 
                      color: 'rgba(255, 255, 255, 0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>📍</span>
                        <span>{item.location}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🏷️</span>
                        <span>{item.category} • {item.color}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>👤</span>
                        <span>{item.reportedBy?.name} ({item.reportedBy?.usn})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>⏰</span>
                        <span>{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-sm)',
                    marginTop: 'auto'
                  }}>
                    <Link 
                      href={`/items/${item._id}`} 
                      className="btn btn-secondary" 
                      style={{ 
                        flex: 1, 
                        fontSize: '14px', 
                        padding: '10px 16px',
                        textAlign: 'center'
                      }}
                    >
                      View Details
                    </Link>
                    {auth.isAuthenticated() && item.status === 'active' && (
                      <button 
                        onClick={() => handleClaim(item._id)}
                        className="btn btn-primary" 
                        style={{ 
                          flex: 1, 
                          fontSize: '14px', 
                          padding: '10px 16px'
                        }}
                      >
                        {item.type === 'lost' ? 'I Found This' : 'This is Mine'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => fetchItems(page)}
                    className={`btn ${page === pagination.current ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 16px' }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            {/* No Items Message */}
            {items.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>
                  No items found
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
                  Try adjusting your filters or check back later
                </p>
                {auth.isAuthenticated() && (
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <Link href="/student/report-lost" className="btn btn-primary">
                      Report Lost Item
                    </Link>
                    <Link href="/student/report-found" className="btn btn-secondary">
                      Report Found Item
                    </Link>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}