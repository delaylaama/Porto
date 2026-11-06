import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import CartDrawer from './components/CartDrawer'
import Preloader from './components/Preloader'
import HalftoneTransition from './components/HalftoneTransition'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Playground from './pages/Playground'
import Commissioned from './pages/Commissioned'
import Shop from './pages/Shop'
import './App.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    }
  }, [pathname])
  return null
}

function App() {
  const [cartItems, setCartItems] = useState([
    {
      id: 101,
      cartId: 101,
      title: 'Kinetic Type System: 40+ Modular AE Presets',
      price: 39,
      category: 'Motion Presets',
      format: '.AEP • .MOGRT',
      image: 'https://picsum.photos/seed/kinetic-mogrt/800/600'
    }
  ])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Lenis Smooth Scroll Engine
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    window.__lenis = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }

    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  const handleAddToCart = (product) => {
    const itemToAdd = {
      ...product,
      cartId: Date.now() + Math.random()
    }
    setCartItems(prev => [...prev, itemToAdd])
    setIsCartOpen(true)
  }

  const handleRemoveFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => (item.cartId || item.id) !== cartId))
  }

  const handleCheckout = (total) => {
    alert(`CHECKOUT SEQUENCE INITIATED\n\nTotal: $${total}\nInstant direct download tokens generated.\nCheck your email confirmation for perpetual access keys.`)
    setIsCartOpen(false)
  }

  return (
    <>
      <Preloader />
      <div className="noise-overlay" aria-hidden="true" />
      <CustomCursor />
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartItems.length}
      />
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
      <ScrollToTop />
      <HalftoneTransition />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/commissioned" element={<Commissioned />} />
          <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
