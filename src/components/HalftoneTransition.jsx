import { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import './HalftoneTransition.css'

export default function HalftoneTransition() {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isFirstMount = useRef(true)

  useEffect(() => {
    // Skip animation on initial page load (Preloader handles initial intro)
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }

    setIsTransitioning(true)

    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 650)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (!isTransitioning) return null

  return (
    <div className="halftone-wipe-overlay" aria-hidden="true">
      <div className="halftone-wipe__curtain" />
      <div className="halftone-wipe__pattern" />
      <div className="halftone-wipe__label">
        <span className="halftone-wipe__dot" />
        <span className="halftone-wipe__text">LOADING SEQUENCE // {location.pathname.replace('/', '').toUpperCase() || 'HOME'}</span>
      </div>
    </div>
  )
}
