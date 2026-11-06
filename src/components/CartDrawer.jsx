import { useEffect } from 'react'
import './CartDrawer.css'

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  items = [], 
  onRemoveItem, 
  onCheckout 
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)

  return (
    <div className="cart-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <aside 
        className="cart-drawer" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title-box">
            <h2 className="cart-drawer__title">Studio Atelier</h2>
            <span className="cart-drawer__count-badge">{items.length} Editions</span>
          </div>
          <button 
            className="cart-drawer__close" 
            onClick={onClose}
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Drawer Item List */}
        <div className="cart-drawer__items-container">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6zM3 6h18M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="cart-drawer__empty-title">Your Cart is Empty</h3>
              <p className="cart-drawer__empty-desc">
                Select from our curated digital editions, DaVinci PowerGrades, or 3D assets to prepare your instant download.
              </p>
            </div>
          ) : (
            <div className="cart-drawer__list">
              {items.map((item) => (
                <div key={item.cartId || item.id} className="cart-drawer__item">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="cart-drawer__item-img"
                  />
                  <div className="cart-drawer__item-info">
                    <div className="cart-drawer__item-meta">
                      <span className="cart-drawer__item-category">{item.category}</span>
                      <span className="cart-drawer__item-format">{item.format}</span>
                    </div>
                    <h4 className="cart-drawer__item-title">{item.title}</h4>
                    <div className="cart-drawer__item-actions">
                      <span className="cart-drawer__item-price">${item.price}</span>
                      <button 
                        className="cart-drawer__remove-btn"
                        onClick={() => onRemoveItem(item.cartId || item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Panel */}
        <div className="cart-drawer__footer">
          <div className="cart-drawer__license-row">
            <span className="cart-drawer__license-label">License Grant</span>
            <span className="cart-drawer__license-badge">Commercial Unlimited</span>
          </div>

          <div className="cart-drawer__total-row">
            <span className="cart-drawer__total-label">Subtotal</span>
            <span className="cart-drawer__total-amount">${subtotal}</span>
          </div>

          <button 
            className="cart-drawer__checkout-btn"
            disabled={items.length === 0}
            onClick={() => onCheckout(subtotal)}
          >
            <span>Proceed to Instant Access</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <p className="cart-drawer__guarantee-text">
            SSL encrypted checkout • Instant direct download links + perpetual mirror access
          </p>
        </div>
      </aside>
    </div>
  )
}
