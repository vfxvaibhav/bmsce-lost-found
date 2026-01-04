import Link from 'next/link';

export default function Custom404() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className="glass-card" style={{ padding: '60px 40px', maxWidth: '500px' }}>
        <div style={{ fontSize: '120px', marginBottom: '20px' }}>🔍</div>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: '700', 
          color: 'var(--primary-green)', 
          marginBottom: '16px' 
        }}>
          404
        </h1>
        <h2 style={{ marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '32px',
          fontSize: '18px'
        }}>
          The page you're looking for seems to have gone missing, just like a lost item!
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link href="/items" className="btn btn-secondary">
            Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
}