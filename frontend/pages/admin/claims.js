import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { adminAPI } from '../../utils/api';
import { auth, formatDate } from '../../utils/helpers';

export default function AdminClaims() {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: router.query.status || '',
    search: ''
  });
  const [reviewingClaim, setReviewingClaim] = useState(null);
  const [reviewAction, setReviewAction] = useState('');

  useEffect(() => {
    if (!auth.getAdmin()) {
      router.push('/admin/login');
      return;
    }
    fetchClaims();
  }, [filters]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getClaims(filters);
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClaim = async (claimId, action, notes = '') => {
    try {
      await adminAPI.reviewClaim(claimId, { action, notes });
      alert(`Claim ${action} successfully!`);
      setReviewingClaim(null);
      fetchClaims();
    } catch (error) {
      alert('Failed to review claim');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'badge-warning';
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/admin/dashboard" className="nav-logo">🛡️ BMSCE Admin</Link>
          <ul className="nav-links">
            <li><Link href="/admin/dashboard" className="nav-link">Dashboard</Link></li>
            <li><Link href="/admin/claims" className="nav-link">Claims</Link></li>
            <li><Link href="/admin/items" className="nav-link">Items</Link></li>
            <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Logout</button></li>
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
          <h1 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>Claims Management</h1>
          
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Filter by Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="form-input"
              >
                <option value="">All Claims</option>
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="form-input"
                placeholder="Search claims..."
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {claims.map(claim => (
              <div key={claim._id} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>
                      Claim by {claim.claimedBy?.name} ({claim.claimedBy?.usn})
                    </h3>
                    <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                      Submitted on {formatDate(claim.createdAt)}
                    </p>
                  </div>
                  <span className={`badge ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ color: 'var(--primary-green)', marginBottom: '12px' }}>Claimed Item</h4>
                  <div style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--medium-gray)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem'
                      }}>
                        {claim.item?.image ? (
                          <img 
                            src={`http://localhost:5000/uploads/${claim.item.image}`}
                            alt={claim.item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                          />
                        ) : (claim.item?.type === 'lost' ? '📱' : '🔍')}
                      </div>
                      <div>
                        <h5>{claim.item?.title}</h5>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {claim.item?.category} • {claim.item?.color}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {claim.item?.type === 'lost' ? 'Lost at:' : 'Found at:'} {claim.item?.location}
                        </p>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px' }}>{claim.item?.description}</p>
                  </div>
                </div>

                <div style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ color: 'var(--primary-green)' }}>AI Similarity Analysis</h4>
                    <div style={{ 
                      padding: '8px 16px', 
                      background: claim.similarityScore >= 70 ? 'rgba(0, 255, 136, 0.2)' : claim.similarityScore >= 40 ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                      borderRadius: '20px',
                      color: claim.similarityScore >= 70 ? 'var(--primary-green)' : claim.similarityScore >= 40 ? '#ffc107' : '#ff4757',
                      fontWeight: '600'
                    }}>
                      {claim.similarityScore}% Match
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                    {claim.similarityScore >= 70 ? '🟢 High confidence match - Items appear very similar' :
                     claim.similarityScore >= 40 ? '🟡 Moderate match - Manual verification recommended' :
                     '🔴 Low similarity - Requires careful review'}
                  </p>
                </div>

                <div style={{ padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px', marginBottom: '20px' }}>
                  <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Claim Description</h4>
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{claim.description}</p>
                  {claim.contactInfo && (
                    <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', marginTop: '8px' }}>
                      Contact: {claim.contactInfo}
                    </p>
                  )}
                </div>

                {claim.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleReviewClaim(claim._id, 'reject')}
                      className="btn btn-danger"
                    >
                      ❌ Reject Claim
                    </button>
                    <button
                      onClick={() => handleReviewClaim(claim._id, 'approve')}
                      className="btn btn-primary"
                    >
                      ✅ Approve Claim
                    </button>
                  </div>
                )}

                {claim.status !== 'pending' && claim.reviewedAt && (
                  <div style={{ padding: '12px', background: 'var(--glass-bg)', borderRadius: '8px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    Reviewed on {formatDate(claim.reviewedAt)} by {claim.reviewedBy?.name}
                    {claim.reviewNotes && <p style={{ marginTop: '4px' }}>Notes: {claim.reviewNotes}</p>}
                  </div>
                )}
              </div>
            ))}

            {claims.length === 0 && !loading && (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>No claims found</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {filters.status ? `No ${filters.status} claims at the moment` : 'No claims have been submitted yet'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}