import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { claimsAPI } from '../../utils/api';
import { auth, formatRelativeTime, getStatusColor } from '../../utils/helpers';

export default function MyClaims() {
  const router = useRouter();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchMyClaims();
  }, []);

  const fetchMyClaims = async () => {
    try {
      const response = await claimsAPI.getUserClaims();
      setClaims(response.data.claims);
    } catch (error) {
      console.error('Error fetching claims:', error);
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
        <h1 style={{ color: 'var(--primary-green)', marginBottom: '32px' }}>My Claims</h1>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {claims.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {claims.map(claim => (
                  <div key={claim._id} className="glass-card" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ color: 'var(--primary-green)' }}>
                        Claim for: {claim.item?.title}
                      </h3>
                      <span className={`badge ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </div>

                    <div className="grid grid-2" style={{ marginBottom: '16px' }}>
                      <div>
                        <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Item Details</h4>
                        <p style={{ fontSize: '14px', marginBottom: '4px' }}>{claim.item?.description}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          📍 {claim.item?.location} • 🏷️ {claim.item?.category}
                        </p>
                      </div>
                      
                      <div>
                        <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>My Description</h4>
                        <p style={{ fontSize: '14px', marginBottom: '4px' }}>{claim.description}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                          📞 {claim.contactInfo}
                        </p>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      <p>📅 Claimed on {formatRelativeTime(claim.createdAt)}</p>
                      {claim.similarityScore > 0 && (
                        <p>🤖 AI Similarity: {claim.similarityScore}%</p>
                      )}
                      {claim.reviewedAt && (
                        <p>✅ Reviewed on {formatRelativeTime(claim.reviewedAt)}</p>
                      )}
                      {claim.reviewNotes && (
                        <p style={{ marginTop: '8px', fontStyle: 'italic' }}>
                          Admin Notes: {claim.reviewNotes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>No claims made yet</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px' }}>
                  Browse items to find and claim your lost belongings
                </p>
                <Link href="/items" className="btn btn-primary">
                  Browse Items
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}