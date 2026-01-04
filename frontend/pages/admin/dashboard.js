import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminAPI } from '../../utils/api';
import { auth, formatRelativeTime, getStatusColor } from '../../utils/helpers';

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentAdmin = auth.getAdmin();
    if (!currentAdmin) {
      router.push('/admin/login');
      return;
    }
    setAdmin(currentAdmin);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
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

  const { statistics, recentActivity } = dashboardData || {};

  return (
    <div>
      {/* Admin Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/admin/dashboard" className="nav-logo">
            🛡️ BMSCE Admin Portal
          </Link>
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
        {/* Welcome Section */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: '32px' }}>
          <h1 style={{ marginBottom: '8px', color: 'var(--primary-green)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
            Welcome, {admin?.name} • {admin?.employeeId} • {admin?.department}
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/admin/claims?status=pending" className="btn btn-primary">
              ⚡ Pending Claims ({statistics?.pendingClaims || 0})
            </Link>
            <Link href="/admin/items" className="btn btn-secondary">
              📱 Manage Items
            </Link>
            <Link href="/admin/users" className="btn btn-secondary">
              👥 Manage Users
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-2xl)' }}>
          {[
            { 
              title: 'Total Users', 
              value: statistics?.totalUsers || 0, 
              icon: '👥',
              color: 'var(--primary-green)'
            },
            { 
              title: 'Lost Items', 
              value: statistics?.totalLostItems || 0, 
              icon: '📱',
              color: '#ff6b6b'
            },
            { 
              title: 'Found Items', 
              value: statistics?.totalFoundItems || 0, 
              icon: '🔍',
              color: 'var(--primary-green)'
            },
            { 
              title: 'Resolved', 
              value: statistics?.resolvedItems || 0, 
              icon: '✨',
              color: '#4ecdc4'
            }
          ].map((stat, index) => (
            <div key={index} className="glass-card fade-in-up" style={{ 
              padding: 'var(--spacing-xl)', 
              textAlign: 'center',
              animationDelay: `${index * 0.1}s`,
              background: `linear-gradient(135deg, ${stat.color}10 0%, var(--glass-bg) 100%)`
            }}>
              <div style={{ 
                fontSize: '32px', 
                marginBottom: 'var(--spacing-md)',
                filter: `drop-shadow(0 4px 8px ${stat.color}50)`
              }}>
                {stat.icon}
              </div>
              <h3 style={{ 
                fontSize: '2.5rem', 
                color: stat.color, 
                marginBottom: 'var(--spacing-sm)',
                fontWeight: 'var(--font-weight-bold)'
              }}>
                {stat.value}
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        {/* Claims Overview */}
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>Claims Overview</h3>
          <div className="grid grid-3">
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.8rem', color: '#ffc107', marginBottom: '8px' }}>
                {statistics?.pendingClaims || 0}
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Pending Review</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
                {statistics?.totalClaims || 0}
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Total Claims</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '8px' }}>
                {statistics?.totalClaims > 0 ? Math.round(((statistics?.totalClaims - statistics?.pendingClaims) / statistics?.totalClaims) * 100) : 0}%
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Resolution Rate</p>
            </div>
          </div>
        </div>

        <div className="grid grid-2">
          {/* Recent Items */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-green)' }}>Recent Items</h3>
              <Link href="/admin/items" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
                View All →
              </Link>
            </div>
            
            {recentActivity?.recentItems?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentActivity.recentItems.map(item => (
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
                          {item.type === 'lost' ? '📱' : '🔍'} by {item.reportedBy?.name} ({item.reportedBy?.usn})
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {formatRelativeTime(item.createdAt)}
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
                No recent items
              </p>
            )}
          </div>

          {/* Recent Claims */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary-green)' }}>Recent Claims</h3>
              <Link href="/admin/claims" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
                View All →
              </Link>
            </div>
            
            {recentActivity?.recentClaims?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentActivity.recentClaims.map(claim => (
                  <div key={claim._id} style={{ 
                    padding: '12px', 
                    background: 'var(--glass-bg)', 
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ marginBottom: '4px', fontSize: '14px' }}>
                          Claim by {claim.claimedBy?.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {claim.item?.title}
                        </p>
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
                No recent claims
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card" style={{ padding: '24px', marginTop: '32px' }}>
          <h3 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>Quick Actions</h3>
          <div className="grid grid-3">
            <Link href="/admin/claims?status=pending" className="btn btn-primary" style={{ textAlign: 'center' }}>
              ⚡ Review Pending Claims
            </Link>
            <Link href="/admin/items?status=active" className="btn btn-secondary" style={{ textAlign: 'center' }}>
              📱 Manage Active Items
            </Link>
            <Link href="/admin/users" className="btn btn-secondary" style={{ textAlign: 'center' }}>
              👥 User Management
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}