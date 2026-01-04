import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminAPI } from '../../utils/api';
import { auth, formatDate, getStatusColor } from '../../utils/helpers';

export default function AdminItems() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    category: ''
  });

  useEffect(() => {
    if (!auth.getAdmin()) {
      router.push('/admin/login');
      return;
    }
    fetchItems();
  }, [filters]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getItems(filters);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await adminAPI.deleteItem(itemId);
        fetchItems();
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/admin/dashboard" className="nav-logo">🛡️ BMSCE Admin</Link>
          <ul className="nav-links">
            <li><Link href="/admin/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link href="/admin/users" className="nav-link">Users</Link></li>
            <li><Link href="/admin/items" className="nav-link">Items</Link></li>
            <li><Link href="/admin/claims" className="nav-link">Claims</Link></li>
            <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ color: 'var(--primary-green)', marginBottom: '32px' }}>Items Management</h1>

        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="form-input"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="form-input"
              >
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Books">Books</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-3">
            {items.map(item => (
              <div key={item._id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ color: 'var(--primary-green)' }}>{item.title}</h3>
                    <span className={`badge ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px' }}>
                    {item.description}
                  </p>

                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    <p>📍 {item.location}</p>
                    <p>🏷️ {item.category} • {item.color}</p>
                    <p>👤 {item.reportedBy?.name} ({item.reportedBy?.usn})</p>
                    <p>📅 {formatDate(item.createdAt)}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link 
                    href={`/items/${item._id}`} 
                    className="btn btn-secondary" 
                    style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
                  >
                    View
                  </Link>
                  <button 
                    onClick={() => deleteItem(item._id)}
                    className="btn btn-danger" 
                    style={{ fontSize: '12px', padding: '8px 12px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length === 0 && !loading && (
          <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>No items found</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No items match the current filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}