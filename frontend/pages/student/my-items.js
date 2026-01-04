import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { itemsAPI } from '../../utils/api';
import { auth, formatRelativeTime, getStatusColor } from '../../utils/helpers';

export default function MyItems() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    try {
      const response = await itemsAPI.getUserItems();
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">BMSCE Lost & Found</Link>
          <ul className="nav-links">
            <li><Link href="/student/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link href="/items" className="nav-link">Browse</Link></li>
            <li><Link href="/student/my-items" className="nav-link">My Items</Link></li>
            <li><Link href="/student/my-claims" className="nav-link">My Claims</Link></li>
            <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Sign Out</button></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        <h1 style={{ color: 'var(--primary-green)', marginBottom: '32px' }}>My Reported Items</h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {items.length > 0 ? (
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
                        <p>📅 {formatRelativeTime(item.createdAt)}</p>
                        <p>{item.type === 'lost' ? '📱 Lost Item' : '🔍 Found Item'}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link 
                        href={`/items/${item._id}`} 
                        className="btn btn-secondary" 
                        style={{ flex: 1, fontSize: '12px', padding: '8px 12px' }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>No items reported yet</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
                  Start by reporting a lost or found item
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/student/report-lost" className="btn btn-primary">
                    📱 Report Lost Item
                  </Link>
                  <Link href="/student/report-found" className="btn btn-secondary">
                    🔍 Report Found Item
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}