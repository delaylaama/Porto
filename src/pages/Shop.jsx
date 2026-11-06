import { useState } from 'react'
import Footer from '../components/Footer'
import { shopItems } from '../data/projects'
import './Shop.css'

export default function Shop({ onAddToCart, onOpenCart }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPreview, setSelectedPreview] = useState(null)

  const categories = [
    'All',
    'Motion Presets',
    'Color & LUTs',
    '3D Materials',
    '3D Environments',
    'Project Files',
    'Texture Assets'
  ]

  const filteredItems = shopItems.filter(item => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCat && matchesSearch
  })

  return (
    <div className="shop-page">
      {/* ── ATELIER EDITORIAL HEADER (LIGHT THEME) ── */}
      <section className="shop-hero">
        <div className="shop-hero__inner">
          <div className="shop-hero__eyebrow-row">
            <span className="shop-hero__tag">DIGITAL EDITIONS // 2026</span>
            <span className="shop-hero__sep">•</span>
            <span className="shop-hero__license">ROYALTY-FREE EXTENDED COMMERCIAL LICENSE</span>
          </div>

          <div className="shop-hero__content-grid">
            <div className="shop-hero__title-box">
              <h1 className="shop-hero__title">
                Studio Atelier
                <span className="shop-hero__title-serif">— curated digital editions</span>
              </h1>
              <p className="shop-hero__desc">
                Production-ready project files, procedural shaders, kinetic presets, and DaVinci PowerGrades 
                calibrated for progressive motion directors and 3D artists.
              </p>
            </div>

            <div className="shop-hero__score-badge">
              <div className="shop-hero__score-item">
                <span className="shop-hero__score-label">RATING SCORE</span>
                <span className="shop-hero__score-val">5.0 ★</span>
              </div>
              <div className="shop-hero__score-divider" />
              <div className="shop-hero__score-item">
                <span className="shop-hero__score-label">MASTER FORMATS</span>
                <span className="shop-hero__score-val">AEP • BLEND • DRP • FBX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER & SEARCH BAR ── */}
      <section className="shop-filter-bar">
        <div className="shop-filter-bar__inner">
          {/* Category Chips */}
          <div className="shop-filter-bar__categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`shop-filter-btn ${activeCategory === cat ? 'shop-filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="shop-filter-bar__search">
            <input
              type="text"
              placeholder="Search editions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="shop-search-input"
            />
            <span className="shop-search-icon">🔍</span>
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATALOG GRID WITH HALFTONE SHADOWS ── */}
      <section className="shop-catalog-section">
        <div className="shop-catalog-section__inner">
          <div className="shop-grid">
            {filteredItems.map((item, idx) => (
              <div 
                key={item.id} 
                className="atelier-card-wrapper"
                style={{ 
                  '--card-color': item.color || '#ff2a5f',
                  '--card-color-bg': item.colorBg || '#fff1f2',
                  '--delay': `${idx * 60}ms` 
                }}
              >
                {/* Comic Halftone Drop Shadow Bottom Plate */}
                <div className="atelier-card__halftone-shadow" aria-hidden="true" />

                {/* Foreground Atelier Card */}
                <article className="atelier-card">
                  {/* Futuristic Color Top Rim */}
                  <div className="atelier-card__color-rim" />

                  {/* Image Frame */}
                  <div className="atelier-card__media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                    <div className="atelier-card__overlay" />

                    <div className="atelier-card__media-header">
                      <span className="atelier-card__format-tag">{item.format}</span>
                      <span className="atelier-card__rating">{item.rating}</span>
                    </div>

                    <button 
                      className="atelier-card__inspect-btn"
                      onClick={() => setSelectedPreview(item)}
                    >
                      Quick Inspect
                    </button>
                  </div>

                  {/* Content Block */}
                  <div className="atelier-card__content">
                    <div className="atelier-card__cat-row">
                      <span className="atelier-card__cat">{item.category}</span>
                      <span className="atelier-card__color-pill" />
                    </div>

                    <h2 className="atelier-card__title">{item.title}</h2>
                    <p className="atelier-card__desc">{item.description}</p>

                    {/* Feature Checklist */}
                    {item.features && (
                      <ul className="atelier-card__features">
                        {item.features.slice(0, 3).map((feat, i) => (
                          <li key={i}>
                            <span className="atelier-card__bullet">◆</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Purchase Footer */}
                    <div className="atelier-card__footer">
                      <div className="atelier-card__price-box">
                        <span className="atelier-card__license-label">EXTENDED STUDIO</span>
                        <span className="atelier-card__price">${item.price}</span>
                      </div>

                      <button 
                        className="atelier-card__add-btn"
                        onClick={() => onAddToCart && onAddToCart(item)}
                      >
                        + Add to Bag
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUDIO GUARANTEE & SERVICE TIERS ── */}
      <section className="shop-guarantee-section">
        <div className="shop-guarantee-section__inner">
          <div className="shop-guarantee-card">
            <span className="shop-guarantee-icon">⚡</span>
            <h3 className="shop-guarantee-title">Instant Digital Dispatch</h3>
            <p className="shop-guarantee-desc">
              Direct SSL-encrypted download links generated automatically upon checkout. Permanent cloud backup 
              accessible through your receipt token.
            </p>
          </div>

          <div className="shop-guarantee-card">
            <span className="shop-guarantee-icon">✦</span>
            <h3 className="shop-guarantee-title">Commercial Exemption</h3>
            <p className="shop-guarantee-desc">
              Unlimited commercial broadcasts, music videos, social campaigns, and interactive games. Zero attribution 
              required, lifetime royalty-free.
            </p>
          </div>

          <div className="shop-guarantee-card">
            <span className="shop-guarantee-icon">◈</span>
            <h3 className="shop-guarantee-title">Artist Support &amp; Updates</h3>
            <p className="shop-guarantee-desc">
              Access to our private studio support channel for Octane shader tuning, DaVinci CST color transforms, 
              and After Effects expression debugging.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Preview Lightbox Modal */}
      {selectedPreview && (
        <div className="preview-modal-overlay" onClick={() => setSelectedPreview(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal__header">
              <span className="preview-modal__title">{selectedPreview.title}</span>
              <button className="preview-modal__close" onClick={() => setSelectedPreview(null)}>✕</button>
            </div>
            <div className="preview-modal__body">
              <div className="preview-modal__image-wrap">
                <img src={selectedPreview.image} alt={selectedPreview.title} />
              </div>
              <div className="preview-modal__info">
                <span className="preview-modal__cat">{selectedPreview.category} • {selectedPreview.format}</span>
                <h3 className="preview-modal__h3">{selectedPreview.title}</h3>
                <p className="preview-modal__desc">{selectedPreview.description}</p>
                <div className="preview-modal__features-list">
                  {selectedPreview.features?.map((f, i) => (
                    <div key={i} className="preview-modal__feature-row">✓ {f}</div>
                  ))}
                </div>
                <div className="preview-modal__action-row">
                  <span className="preview-modal__price">${selectedPreview.price}</span>
                  <button 
                    className="preview-modal__buy-btn"
                    onClick={() => {
                      onAddToCart(selectedPreview)
                      setSelectedPreview(null)
                    }}
                  >
                    Add to Bag →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
