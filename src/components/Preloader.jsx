import { useState, useEffect } from 'react'
import './Preloader.css'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Fast, organic progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        // Organic pacing
        const increment = Math.floor(Math.random() * 12) + 6
        return Math.min(prev + increment, 100)
      })
    }, 45)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true)
        if (onComplete) onComplete()
        document.body.classList.add('site-loaded')
      }, 250)

      const removeTimer = setTimeout(() => {
        setIsDone(true)
      }, 900)

      return () => {
        clearTimeout(exitTimer)
        clearTimeout(removeTimer)
      }
    }
  }, [progress, onComplete])

  if (isDone) return null

  return (
    <div className={`preloader-overlay ${isExiting ? 'preloader-overlay--exiting' : ''}`} aria-hidden="true">
      <div className="preloader-curtain" />

      <div className="preloader-content">
        {/* Animated Studio Monogram / Aperture */}
        <div className="preloader-aperture">
          <div className="preloader-aperture__ring" />
          <div className="preloader-aperture__dot" />
        </div>

        {/* Monolithic Animated Brand Typography */}
        <div className="preloader-brand">
          <span className="preloader-brand__name">THEJAS</span>
          <span className="preloader-brand__tag">STUDIO // 2026</span>
        </div>

        {/* Loading Progress Bar & Telemetry */}
        <div className="preloader-progress-box">
          <div className="preloader-progress-track">
            <div 
              className="preloader-progress-fill" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          <div className="preloader-telemetry">
            <span className="preloader-telemetry__status">
              {progress < 40 && 'INITIALIZING COLOR ENGINE...'}
              {progress >= 40 && progress < 80 && 'LOADING 3D SCENE & REEL TIMELINE...'}
              {progress >= 80 && progress < 100 && 'CALIBRATING ACES COLOR TRANSFORM...'}
              {progress === 100 && 'READY // WELCOME'}
            </span>
            <span className="preloader-telemetry__count">
              {String(progress).padStart(3, '0')}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
