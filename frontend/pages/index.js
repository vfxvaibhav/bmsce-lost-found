import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '../utils/helpers';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setIsAuthenticated(auth.isAuthenticated());
    setUser(auth.getUser());
  }, []);

  return (
    <div>
      {/* Apple-style Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            BMSCE Lost & Found
          </Link>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li><Link href="/student/dashboard" className="nav-link">Dashboard</Link></li>
                <li><Link href="/items" className="nav-link">Browse</Link></li>
                <li><button onClick={auth.logout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer'}}>Sign Out</button></li>
              </>
            ) : (
              <>
                <li><Link href="/items" className="nav-link">Browse</Link></li>
                <li><Link href="/login" className="nav-link">Sign In</Link></li>
                <li><Link href="/register" className="nav-link">Sign Up</Link></li>
                <li><Link href="/admin/login" className="nav-link">Admin</Link></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Apple-style Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(48, 209, 88, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(48, 209, 88, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }}></div>

        <div className="container">
          <div className="fade-in-up">
            <h1 className="hero-title">
              Lost Something?
              <br />
              <span style={{ color: 'var(--primary-green)' }}>We'll Help You Find It.</span>
            </h1>
            
            <p style={{ 
              fontSize: 'clamp(18px, 3vw, 24px)', 
              marginBottom: 'var(--spacing-2xl)', 
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '600px',
              margin: '0 auto var(--spacing-2xl)',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: '1.5'
            }}>
              AI-powered platform connecting BMSCE students with their lost belongings.
              Report, search, and reclaim with intelligent matching.
            </p>
            
            {isAuthenticated ? (
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-2xl)'
              }}>
                <Link href="/student/report-lost" className="btn btn-primary btn-large">
                  📱 Report Lost Item
                </Link>
                <Link href="/student/report-found" className="btn btn-secondary btn-large">
                  🔍 Report Found Item
                </Link>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-2xl)'
              }}>
                <Link href="/register" className="btn btn-primary btn-large">
                  Get Started
                </Link>
                <Link href="/items" className="btn btn-secondary btn-large">
                  Browse Items
                </Link>
              </div>
            )}

            {/* Trust Indicators */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--spacing-xl)',
              flexWrap: 'wrap',
              opacity: 0.7
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-green)' }}>500+</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Items Reunited</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-green)' }}>95%</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Success Rate</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-green)' }}>1000+</div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Happy Students</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <h2 className="section-title fade-in-up">How It Works</h2>
          
          <div className="grid grid-3">
            {[
              {
                icon: '📱',
                title: 'Report Your Item',
                description: 'Upload a photo and details of your lost or found item with our simple form.'
              },
              {
                icon: '🤖',
                title: 'AI Matching',
                description: 'Our intelligent system compares images and details to find potential matches.'
              },
              {
                icon: '✨',
                title: 'Get Reunited',
                description: 'Admin verification ensures safe and secure item returns to rightful owners.'
              }
            ].map((step, index) => (
              <div key={index} className="glass-card fade-in-up" style={{ 
                padding: 'var(--spacing-xl)', 
                textAlign: 'center',
                animationDelay: `${index * 0.2}s`
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: 'var(--spacing-lg)',
                  filter: 'drop-shadow(0 4px 8px rgba(48, 209, 88, 0.3))'
                }}>
                  {step.icon}
                </div>
                <h3 className="card-title">{step.title}</h3>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  lineHeight: '1.6',
                  fontSize: '16px'
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0', background: 'var(--glass-bg)' }}>
        <div className="container">
          <h2 className="section-title">Why Choose BMSCE Lost & Found?</h2>
          
          <div className="grid grid-2" style={{ gap: 'var(--spacing-xl)' }}>
            {[
              {
                title: 'AI-Powered Matching',
                description: 'Advanced machine learning algorithms analyze images to find the best matches for your lost items.',
                icon: '🧠'
              },
              {
                title: 'Secure & Verified',
                description: 'Admin verification process ensures items are returned to their rightful owners safely.',
                icon: '🔒'
              },
              {
                title: 'Real-time Updates',
                description: 'Get instant notifications when potential matches are found or when your claims are processed.',
                icon: '⚡'
              },
              {
                title: 'Mobile Optimized',
                description: 'Fully responsive design works seamlessly across all devices and screen sizes.',
                icon: '📱'
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card" style={{ 
                padding: 'var(--spacing-xl)',
                display: 'flex',
                gap: 'var(--spacing-lg)',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  fontSize: '32px',
                  filter: 'drop-shadow(0 2px 4px rgba(48, 209, 88, 0.3))'
                }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="card-title">{feature.title}</h3>
                  <p style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <div className="glass-card" style={{ 
            padding: 'var(--spacing-3xl)', 
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(48, 209, 88, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)'
          }}>
            <h2 style={{ 
              fontSize: 'clamp(28px, 4vw, 40px)', 
              fontWeight: 'var(--font-weight-bold)',
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--white)'
            }}>
              Ready to Find Your Lost Items?
            </h2>
            <p style={{ 
              fontSize: '18px', 
              marginBottom: 'var(--spacing-xl)', 
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '500px',
              margin: '0 auto var(--spacing-xl)'
            }}>
              Join thousands of BMSCE students who have successfully reunited with their belongings.
            </p>
            
            {!isAuthenticated && (
              <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/register" className="btn btn-primary btn-large">
                  Sign Up Now
                </Link>
                <Link href="/items" className="btn btn-secondary btn-large">
                  Browse Items
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        padding: 'var(--spacing-xl) 0', 
        textAlign: 'center', 
        borderTop: '1px solid var(--glass-border)',
        background: 'var(--glass-bg)'
      }}>
        <div className="container">
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '14px'
          }}>
            © 2024 BMSCE Lost & Found Management System. Built with ❤️ for BMSCE students.
          </p>
        </div>
      </footer>
    </div>
  );
}