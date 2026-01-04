import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { itemsAPI, claimsAPI } from '../../utils/api';
import { auth, formatDate } from '../../utils/helpers';

export default function ItemDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimData, setClaimData] = useState({
    description: '',
    contactInfo: ''
  });

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await itemsAPI.getById(id);
      setItem(response.data.item);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    setClaiming(true);
    try {
      await claimsAPI.create({
        itemId: item._id,
        description: claimData.description,
        contactInfo: claimData.contactInfo
      });
      alert('Claim submitted successfully! The item owner will be notified.');
      router.push('/student/dashboard');
    } catch (error) {
      alert('Failed to submit claim. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Item not found</h2>
          <Link href="/items" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Back to Items
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">BMSCE Lost & Found</Link>
          <ul className="nav-links">
            <li><Link href="/items" className="nav-link">← Back</Link></li>
            {auth.isAuthenticated() && (
              <li><Link href="/student/dashboard" className="nav-link">Dashboard</Link></li>
            )}
          </ul>
        </div>
      </nav>

      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="grid grid-2" style={{ gap: '40px', alignItems: 'start' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{
              width: '100%',
              height: '400px',
              background: 'var(--glass-bg)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6rem',
              marginBottom: '20px'
            }}>
              {item.image ? (
                <img 
                  src={`http://localhost:5000/uploads/${item.image}`}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                />
              ) : (
                item.type === 'lost' ? '📱' : '🔍'
              )}
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <span className={`badge ${item.type === 'lost' ? 'badge-danger' : 'badge-success'}`}>
                {item.type === 'lost' ? 'LOST ITEM' : 'FOUND ITEM'}
              </span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '32px' }}>
            <h1 style={{ color: 'var(--primary-green)', marginBottom: '20px' }}>
              {item.title}
            </h1>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '8px' }}>Description</h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                {item.description}
              </p>
            </div>

            <div className="grid grid-2" style={{ marginBottom: '24px' }}>
              <div>
                <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Category</h4>
                <p>{item.category}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Color</h4>
                <p>{item.color}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Location</h4>
                <p>{item.location}</p>
              </div>
              <div>
                <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Date</h4>
                <p>{formatDate(item.dateLostFound)}</p>
              </div>
            </div>

            <div style={{ marginBottom: '32px', padding: '16px', background: 'var(--glass-bg)', borderRadius: '8px' }}>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '8px' }}>Reported By</h4>
              <p>{item.reportedBy?.name}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {item.reportedBy?.usn} • {item.reportedBy?.department}
              </p>
            </div>

            {auth.isAuthenticated() && item.status === 'active' && (
              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
                <h3 style={{ color: 'var(--primary-green)', marginBottom: '16px' }}>
                  {item.type === 'lost' ? 'I Found This Item' : 'This is My Item'}
                </h3>
                
                <form onSubmit={handleClaim}>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                      value={claimData.description}
                      onChange={(e) => setClaimData({...claimData, description: e.target.value})}
                      className="form-input"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Info</label>
                    <input
                      type="text"
                      value={claimData.contactInfo}
                      onChange={(e) => setClaimData({...claimData, contactInfo: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    disabled={claiming}
                  >
                    {claiming ? 'Submitting...' : 'Submit Claim'}
                  </button>
                </form>
              </div>
            )}

            {!auth.isAuthenticated() && (
              <div style={{ textAlign: 'center', padding: '24px', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                <p style={{ marginBottom: '16px' }}>Please login to make a claim</p>
                <Link href="/login" className="btn btn-primary">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}