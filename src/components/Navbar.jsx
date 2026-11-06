import { useState, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ onOpenCart, cartCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navLinks = [
    { to: '/', label: 'Showreel', num: '01' },
    { to: '/portfolio', label: 'Portfolio', num: '02' },
    { to: '/playground', label: 'The Lab', num: '03' },
    { to: '/commissioned', label: 'Commissions', num: '04' },
    { to: '/shop', label: 'Atelier', num: '05' },
  ]

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${isOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__inner">
        {/* Studio Branding */}
        <NavLink to="/" className="navbar__logo" aria-label="Thejas Studio Home">
          <span className="navbar__logo-main">THEJAS</span>
          <span className="navbar__logo-sub">STUDIO</span>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className={`navbar__nav ${isOpen ? 'navbar__nav--open' : ''}`} aria-label="Main navigation">
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.to} className="navbar__item">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}
                  end={link.to === '/'}
                >
                  <span className="navbar__link-num">{link.num}</span>
                  <span className="navbar__link-text">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__mobile-footer">
            <p className="navbar__mobile-tagline">Direction · Motion Systems · 3D Environments</p>
            <div className="navbar__mobile-socials">
              <a href="https://behance.net" target="_blank" rel="noreferrer">Behance</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://vimeo.com" target="_blank" rel="noreferrer">Vimeo</a>
            </div>
          </div>
        </nav>

        {/* Action Controls */}
        <div className="navbar__actions">
          {/* Cart Trigger */}
          <button 
            className="navbar__cart-btn"
            onClick={onOpenCart}
            aria-label="Open cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="navbar__cart-label">Bag</span>
            {cartCount > 0 && (
              <span className="navbar__cart-count">{cartCount}</span>
            )}
          </button>

          {/* Direct Commission CTA */}
          <Link to="/commissioned" className="navbar__cta-btn">
            Initiate Project
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className={`navbar__burger ${isOpen ? 'navbar__burger--open' : ''}`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
          >
            <span className="navbar__burger-line" />
            <span className="navbar__burger-line" />
          </button>
        </div>
      </div>
    </header>
  )
}
