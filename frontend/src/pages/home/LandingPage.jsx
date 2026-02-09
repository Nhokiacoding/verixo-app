import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Floating Telegram Button */}
      <a 
        href="https://t.me/+wkfQk82qG7A2NTBk" 
        target="_blank" 
        rel="noopener noreferrer"
        className="floating-telegram"
        title="Join our Telegram for updates"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
        </svg>
      </a>

      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="nav-content">
            <div className="logo" onClick={() => navigate('/')}>
              <div className="logo-icon">V</div>
              <span className="logo-text">Verixo</span>
            </div>

            {/* Desktop Menu */}
            <ul className="nav-menu desktop-menu">
              <li><a onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a onClick={() => scrollToSection('about')}>About</a></li>
              <li><a onClick={() => scrollToSection('services')}>Services</a></li>
              <li><a onClick={() => scrollToSection('pricing')}>Pricing</a></li>
              <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>

            <div className="nav-actions desktop-menu">
              <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
            </div>

            {/* Hamburger Menu */}
            <button 
              className="hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={mobileMenuOpen ? 'active' : ''}></span>
              <span className={mobileMenuOpen ? 'active' : ''}></span>
              <span className={mobileMenuOpen ? 'active' : ''}></span>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a onClick={() => scrollToSection('about')}>About</a></li>
              <li><a onClick={() => scrollToSection('services')}>Services</a></li>
              <li><a onClick={() => scrollToSection('pricing')}>Pricing</a></li>
              <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>
            <div className="mobile-actions">
              <button className="btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-bg-animation"></div>
        <div className="container">
          <div className="hero-content">
            <div className="badge animate-bounce-in">
              <span className="badge-icon">🚀</span>
              <span>Trusted by 10,000+ Users Worldwide</span>
            </div>
            
            <h1 className="hero-title animate-fade-in-up">
              Get Virtual Numbers for
              <span className="gradient-text"> SMS Verification</span>
            </h1>
            
            <p className="hero-description animate-fade-in-up delay-1">
              Secure, reliable, and instant virtual phone numbers for all your verification needs. 
              Support for WhatsApp, Telegram, Twitter, and 100+ services worldwide.
            </p>
            
            <div className="hero-buttons animate-fade-in-up delay-2">
              <button className="btn-hero-primary" onClick={() => navigate('/register')}>
                Get Started Now
                <span className="btn-icon">→</span>
              </button>
              <button className="btn-hero-secondary" onClick={() => navigate('/register')}>
                Create Account
              </button>
            </div>

            <div className="hero-stats animate-fade-in-up delay-3">
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Services</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Countries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-wave"></div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">About Verixo</h2>
            <p className="section-subtitle">Your trusted partner for virtual phone numbers</p>
          </div>
          
          <div className="about-content">
            <div className="about-text">
              <h3>Who We Are</h3>
              <p>
                Verixo is a leading provider of virtual phone numbers for SMS verification. 
                We help individuals and businesses verify their accounts on various platforms 
                quickly, securely, and affordably.
              </p>
              <p>
                With years of experience in the industry, we've built a reputation for 
                reliability, security, and excellent customer service. Our platform serves 
                thousands of satisfied customers worldwide.
              </p>
              <div className="about-features">
                <div className="feature-badge">
                  <span className="feature-icon">✓</span>
                  <span>Instant Delivery</span>
                </div>
                <div className="feature-badge">
                  <span className="feature-icon">✓</span>
                  <span>100% Secure</span>
                </div>
                <div className="feature-badge">
                  <span className="feature-icon">✓</span>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <div className="floating-card card-1">
                  <div className="card-icon">🔒</div>
                  <div className="card-text">Secure</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">⚡</div>
                  <div className="card-text">Fast</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">🌍</div>
                  <div className="card-text">Global</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">Virtual numbers for all major platforms</p>
          </div>
          
          <div className="services-grid">
            {[
              { name: 'WhatsApp', icon: '💬', color: '#25D366', popular: true },
              { name: 'Telegram', icon: '✈️', color: '#0088cc', popular: true },
              { name: 'Twitter/X', icon: '🐦', color: '#1DA1F2', popular: true },
              { name: 'Facebook', icon: '👥', color: '#1877F2', popular: false },
              { name: 'Instagram', icon: '📷', color: '#E4405F', popular: false },
              { name: 'Discord', icon: '🎮', color: '#5865F2', popular: false },
              { name: 'TikTok', icon: '🎵', color: '#000000', popular: false },
              { name: 'LinkedIn', icon: '💼', color: '#0A66C2', popular: false },
            ].map((service, index) => (
              <div key={index} className="service-card" style={{ '--card-color': service.color }}>
                {service.popular && <div className="popular-badge">Popular</div>}
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-name">{service.name}</h3>
                <p className="service-desc">Get instant verification codes</p>
                <button className="service-btn" onClick={() => navigate('/register')}>Get Number</button>
              </div>
            ))}
          </div>
          
          <div className="services-cta">
            <button className="btn-primary-large" onClick={() => navigate('/register')}>
              View All 100+ Services
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Verixo?</h2>
            <p className="section-subtitle">The best virtual number service in the market</p>
          </div>
          
          <div className="features-grid">
            {[
              {
                icon: '⚡',
                title: 'Instant Delivery',
                description: 'Get your virtual number instantly. No waiting, no delays - start verifying immediately.',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              },
              {
                icon: '🛡️',
                title: '100% Secure',
                description: 'Your privacy is our priority. All numbers are private and secure with no data logging.',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
              },
              {
                icon: '🌍',
                title: 'Global Coverage',
                description: 'Numbers from 50+ countries including US, UK, Canada, Germany, and many more.',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
              },
              {
                icon: '💰',
                title: 'Affordable Pricing',
                description: 'Starting from just ₦3,200 per number. No hidden fees, no monthly subscriptions.',
                gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              },
              {
                icon: '👥',
                title: '24/7 Support',
                description: 'Our dedicated support team is available around the clock to help you succeed.',
                gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
              },
              {
                icon: '⏱️',
                title: 'Fast SMS Delivery',
                description: 'Receive SMS codes within seconds. Average delivery time under 30 seconds.',
                gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper" style={{ background: feature.gradient }}>
                  <span className="feature-icon-large">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in 3 simple steps</p>
          </div>
          
          <div className="steps-container">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up for free and add funds to your wallet',
                icon: '👤'
              },
              {
                step: '02',
                title: 'Choose Service',
                description: 'Select the service and country you need',
                icon: '📱'
              },
              {
                step: '03',
                title: 'Get Number',
                description: 'Receive your virtual number instantly',
                icon: '✅'
              }
            ].map((item, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
                {index < 2 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Pay only for what you use. No monthly fees.</p>
          </div>
          
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-title">Starter</h3>
                <p className="pricing-subtitle">Perfect for personal use</p>
              </div>
              <div className="pricing-price">
                <span className="currency">₦</span>
                <span className="amount">3,500</span>
                <span className="period">/number</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> Basic services</li>
                <li><span className="check-icon">✓</span> 5+ countries</li>
                <li><span className="check-icon">✓</span> 20-min validity</li>
                <li><span className="check-icon">✓</span> Email support</li>
              </ul>
              <button className="pricing-btn" onClick={() => navigate('/register')}>
                Get Started
              </button>
            </div>

            <div className="pricing-card featured">
              <div className="popular-tag">Most Popular</div>
              <div className="pricing-header">
                <h3 className="pricing-title">Pro</h3>
                <p className="pricing-subtitle">Best for businesses</p>
              </div>
              <div className="pricing-price">
                <span className="currency">₦</span>
                <span className="amount">3,200</span>
                <span className="period">/number</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> All services (100+)</li>
                <li><span className="check-icon">✓</span> 50+ countries</li>
                <li><span className="check-icon">✓</span> 30-min validity</li>
                <li><span className="check-icon">✓</span> Priority support</li>
                <li><span className="check-icon">✓</span> API access</li>
              </ul>
              <button className="pricing-btn" onClick={() => navigate('/register')}>
                Get Started
              </button>
            </div>

            <div className="pricing-card">
              <div className="pricing-header">
                <h3 className="pricing-title">Enterprise</h3>
                <p className="pricing-subtitle">For large operations</p>
              </div>
              <div className="pricing-price">
                <span className="amount-custom">Custom</span>
                <span className="period">volume pricing</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check-icon">✓</span> Everything in Pro</li>
                <li><span className="check-icon">✓</span> Volume discounts</li>
                <li><span className="check-icon">✓</span> Account manager</li>
                <li><span className="check-icon">✓</span> 24/7 phone support</li>
                <li><span className="check-icon">✓</span> Custom integrations</li>
              </ul>
              <button className="pricing-btn" onClick={() => scrollToSection('contact')}>
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Join thousands of satisfied customers</p>
          </div>
          
          <div className="testimonials-grid">
            {[
              {
                text: "Verixo has been a game-changer for my business. The numbers work instantly and the support is excellent. Highly recommended!",
                author: "Alex Johnson",
                role: "Digital Marketer",
                image: "https://i.pravatar.cc/150?img=12",
                rating: 5
              },
              {
                text: "Fast, reliable, and affordable. I've tried other services but Verixo is by far the best. The SMS codes arrive within seconds.",
                author: "Sarah Chen",
                role: "E-commerce Owner",
                image: "https://i.pravatar.cc/150?img=45",
                rating: 5
              },
              {
                text: "Perfect for managing multiple social media accounts. The variety of countries and services available is impressive.",
                author: "Mike Rodriguez",
                role: "Social Media Manager",
                image: "https://i.pravatar.cc/150?img=33",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.author} className="author-avatar-img" />
                  <div className="author-info">
                    <div className="author-name">{testimonial.author}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Get In Touch</h2>
            <p className="section-subtitle">Have questions? We're here to help 24/7</p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon email-icon">
                <span>📧</span>
              </div>
              <h3 className="contact-title">Email Support</h3>
              <p className="contact-description">Get help via email</p>
              <a href="mailto:felizcecilia48@gmail.com" className="contact-link">
                felizcecilia48@gmail.com
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon phone-icon">
                <span>📞</span>
              </div>
              <h3 className="contact-title">Phone Support</h3>
              <p className="contact-description">Call us directly</p>
              <a href="tel:+2347070045479" className="contact-link">
                +234 707 004 5479
              </a>
            </div>

            <div className="contact-card">
              <div className="contact-icon whatsapp-icon">
                <span>💬</span>
              </div>
              <h3 className="contact-title">WhatsApp</h3>
              <p className="contact-description">Chat with us instantly</p>
              <a href="https://wa.me/2348130498991" target="_blank" rel="noopener noreferrer" className="contact-link">
                +234 813 049 8991
              </a>
            </div>
          </div>

          <div className="cta-box">
            <h3 className="cta-title">Ready to Get Started?</h3>
            <p className="cta-description">
              Join thousands of users who trust Verixo for their verification needs. 
              Get your first virtual number in seconds.
            </p>
            <div className="cta-buttons">
              <button className="btn-cta-primary" onClick={() => navigate('/register')}>
                Create Account
              </button>
              <button className="btn-cta-secondary" onClick={() => navigate('/login')}>
                Login to Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">V</div>
                <span className="logo-text">Verixo</span>
              </div>
              <p className="footer-description">
                The most reliable virtual number service for SMS verification worldwide.
              </p>
              <div className="footer-contact-info">
                <div className="footer-contact-item">
                  <span className="contact-icon">�</span>
                  <span>Lagos, Nigeria</span>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">📧</span>
                  <a href="mailto:felizcecilia48@gmail.com">felizcecilia48@gmail.com</a>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">📞</span>
                  <a href="tel:+2347070045479">+234 707 004 5479</a>
                </div>
              </div>
              <div className="social-links">
                <a href="https://t.me/+wkfQk82qG7A2NTBk" target="_blank" rel="noopener noreferrer" className="social-link telegram-link" title="Join our Telegram for updates">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">Services</h4>
                <ul>
                  <li><a href="#" onClick={() => navigate('/register')}>WhatsApp Numbers</a></li>
                  <li><a href="#" onClick={() => navigate('/register')}>Telegram Numbers</a></li>
                  <li><a href="#" onClick={() => navigate('/register')}>Twitter Numbers</a></li>
                  <li><a href="#" onClick={() => navigate('/register')}>All Services</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <ul>
                  <li><a href="#" onClick={() => scrollToSection('about')}>About Us</a></li>
                  <li><a href="#" onClick={() => scrollToSection('pricing')}>Pricing</a></li>
                  <li><a href="#" onClick={() => scrollToSection('contact')}>Contact</a></li>
                  <li><a href="https://t.me/+wkfQk82qG7A2NTBk" target="_blank" rel="noopener noreferrer">Telegram Updates</a></li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Support</h4>
                <ul>
                  <li><a href="#" onClick={() => scrollToSection('contact')}>Help Center</a></li>
                  <li><a href="#">API Documentation</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Verixo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
