import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminAPI } from '../../utils/api';
import { auth, formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.getAdmin()) {
      router.push('/admin/login');
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
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
        <h1 style={{ color: 'var(--primary-green)', marginBottom: '32px' }}>User Management</h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>USN</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>Department</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: 'var(--primary-green)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <td style={{ padding: '12px' }}>{user.name}</td>
                      <td style={{ padding: '12px' }}>{user.usn}</td>
                      <td style={{ padding: '12px' }}>{user.email}</td>
                      <td style={{ padding: '12px' }}>{user.department}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => toggleUserStatus(user._id)}
                          className={`btn ${user.isActive ? 'btn-danger' : 'btn-primary'}`}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}