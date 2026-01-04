import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { itemsAPI, claimsAPI } from '../../utils/api';
import { auth, formatRelativeTime, getStatusColor } from '../../utils/helpers';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    myLostItems: 0,
    myFoundItems: 0,
    myClaims: 0,
    claimsForMyItems: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [recentClaims, setRecentClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [itemsRes, claimsRes, claimsForItemsRes] = await Promise.all([
        itemsAPI.getUserItems(),
        claimsAPI.getUserClaims(),
        claimsAPI.getClaimsForUserItems()
      ]);

      const items = itemsRes.data.items;
      const claims = claimsRes.data.claims;
      const claimsForItems = claimsForItemsRes.data.claims;

      setStats({
        myLostItems: items.filter(item => item.type === 'lost').length,
        myFoundItems: items.filter(item => item.type === 'found').length,
        myClaims: claims.length,
        claimsForMyItems: claimsForItems.length
      });

      setRecentItems(items.slice(0, 5));
      setRecentClaims(claims.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">BMSCE Lost & Found</Link>
          <ul className="nav-links">
            <li><Link href="/student/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link href="/items" className="nav-link">Browse Items</Link></li>
            <li><Link href="/student/my-items" className="nav-link">My Items</Link></li>
            <li><Link href="/student/my-claims" className="nav-link">My Claims</Link></li>
            <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        {/* Welcome Section */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h1 style={{ marginBottom: '8px', color: 'var(--primary-green)' }}>
            Welcome back, {user?.name}!
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
            {user?.usn} • {user?.department} • Year {user?.year}
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/student/report-lost" className="btn btn-primary">
              📱 Report Lost Item
            </Link>
            <Link href="/student/report-found" className="btn btn-secondary">
              🔍 Report Found Item
            </Link>
            <Link href="/items" className="btn btn-secondary">
              👀 Browse All Items
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
              {stats.myLostItems}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Lost Items Reported</p>
          </div>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
              {stats.myFoundItems}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Found Items Reported</p>
          </div>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
              {stats.myClaims}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Claims Made</p>
          </div>
          
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
              {stats.claimsForMyItems}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Claims on My Items</p>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Recent Items */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-green)' }}>Recent Items</h3>
              <Link href="/student/my-items" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
                View All →
              </Link>
            </div>
            
            {recentItems.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentItems.map(item => (
                  <div key={item._id} style={{ 
                    padding: '12px', 
                    background: 'var(--glass-bg)', 
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ marginBottom: '4px', fontSize: '14px' }}>{item.title}</h4>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {item.type === 'lost' ? '📱' : '🔍'} {item.category} • {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '20px' }}>
                No items reported yet
              </p>
            )}
          </div>

          {/* Recent Claims */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-green)' }}>Recent Claims</h3>
              <Link href="/student/my-claims" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
                View All →
              </Link>
            </div>
            
            {recentClaims.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentClaims.map(claim => (
                  <div key={claim._id} style={{ 
                    padding: '12px', 
                    background: 'var(--glass-bg)', 
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ marginBottom: '4px', fontSize: '14px' }}>
                          {claim.lostItem?.title} ↔ {claim.foundItem?.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          AI Match: {claim.similarityScore}% • {formatRelativeTime(claim.createdAt)}
                        </p>
                      </div>
                      <span className={`badge ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', padding: '20px' }}>
                No claims made yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}