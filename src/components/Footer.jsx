import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      {/* Editorial Marquee Strip */}
      <div className="footer__marquee" aria-hidden="true">
        <div className="footer__marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="footer__marquee-content">
              <span>// MULTIDISCIPLINARY 3D ARTIST</span>
              <span>+ MOTION DESIGNER</span>
              <span>+ CREATIVE DIRECTOR</span>
              <span>// REALTIME COMPOSITING • UNREAL ENGINE 5.4</span>
              <span>// TYPOGRAPHIC SYSTEMS &amp; CINEMA</span>
              <span>// AVAILABLE FOR GLOBAL COMMERCIALS &amp; ALBUM CAMPAIGNS</span>
            </div>
          ))}
        </div>
      </div>

      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand Col */}
          <div className="footer__brand-col">
            <h2 className="footer__brand-logo">
              KINETIC <span>// 01</span>
            </h2>
            <p className="footer__brand-statement">
              Obsidian-grade motion graphic systems, procedural 3D visual direction, and bespoke real-time 
              rendering environments for progressive creative directors and studios.
            </p>
            <div className="footer__stack-tags">
              <span className="footer__stack-label">Stack:</span>
              <span className="footer__stack-pill">Unreal 5.4</span>
              <span className="footer__stack-pill">Blender</span>
              <span className="footer__stack-pill">After Effects</span>
              <span className="footer__stack-pill">DaVinci Studio</span>
              <span className="footer__stack-pill">Premiere</span>
            </div>
          </div>

          {/* Directory */}
          <div className="footer__nav-col">
            <span className="footer__col-heading">Directory</span>
            <ul className="footer__nav-links">
              <li><Link to="/">Showreel &amp; Overview</Link></li>
              <li><Link to="/portfolio">Curated Portfolio</Link></li>
              <li><Link to="/playground">The Lab (R&amp;D)</Link></li>
              <li><Link to="/commissioned">Commissions &amp; Treatments</Link></li>
              <li><Link to="/shop">Studio Atelier (Editions)</Link></li>
            </ul>
          </div>

          {/* Signals & Contact */}
          <div className="footer__signals-col">
            <span className="footer__col-heading">Signals &amp; Presence</span>
            <div className="footer__social-links">
              <a href="https://behance.net" target="_blank" rel="noreferrer">Behance</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://vimeo.com" target="_blank" rel="noreferrer">Vimeo</a>
              <a href="https://artstation.com" target="_blank" rel="noreferrer">Artstation</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">X / Twitter</a>
            </div>

            <div className="footer__inquiries-card">
              <span className="footer__inquiries-label">Direct Inquiries:</span>
              <a href="mailto:studio@thejas-motion.xyz" className="footer__inquiries-email">
                studio@thejas-motion.xyz
              </a>
            </div>
          </div>
        </div>

        {/* Colophon & Copyright */}
        <div className="footer__colophon">
          <p className="footer__copyright">
            © {currentYear} KINETIC MOTION ARCHITECTURE. ALL RIGHTS RESERVED.
          </p>
          <div className="footer__meta-details">
            <span>DIRECTOR &amp; 3D GENERALIST</span>
            <span className="footer__meta-sep">•</span>
            <span>NEW YORK &amp; REMOTE WORLDWIDE</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
