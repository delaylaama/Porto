import { useState, useRef } from 'react'
import { playTick } from '../utils/audioSystem'
import './ColorGradeSlider.css'

export default function ColorGradeSlider({ logImage, gradeImage, label = "DaVinci Resolve CST // Rec.709 vs 35mm Print Grade" }) {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)
  const lastTickPos = useRef(50)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percentage)

    // Tactile micro-tick every 3% of dial movement
    if (Math.abs(percentage - lastTickPos.current) > 3) {
      playTick(0.85 + (percentage / 100) * 0.4)
      lastTickPos.current = percentage
    }
  }

  const handleTouchMove = (e) => {
    handleMove(e.touches[0].clientX)
  }

  const handleMouseMove = (e) => {
    if (isDragging || e.buttons === 1) {
      handleMove(e.clientX)
    }
  }

  return (
    <div className="color-grade-slider">
      <div className="color-grade-slider__header">
        <span className="color-grade-slider__label">{label}</span>
        <div className="color-grade-slider__tags">
          <span className="color-grade-slider__tag color-grade-slider__tag--log">RAW LOG C3</span>
          <span className="color-grade-slider__sep">↔</span>
          <span className="color-grade-slider__tag color-grade-slider__tag--grade">KODAK 2383 PRINT</span>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="color-grade-slider__viewport"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {/* Full Finished Grade Image (Background) */}
        <img 
          src={gradeImage} 
          alt="Final Color Grade" 
          className="color-grade-slider__img color-grade-slider__img--grade"
        />

        {/* Clipped Flat Log Image (Foreground) */}
        <div 
          className="color-grade-slider__clip"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <img 
            src={logImage} 
            alt="Flat Log Camera Feed" 
            className="color-grade-slider__img color-grade-slider__img--log"
          />
          <span className="color-grade-slider__badge color-grade-slider__badge--left">
            RAW CAMERA LOG
          </span>
        </div>

        <span className="color-grade-slider__badge color-grade-slider__badge--right">
          FINAL FILM GRADE
        </span>

        {/* Draggable Divider Line & Dial Handle */}
        <div 
          className="color-grade-slider__handle"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="color-grade-slider__dial">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="color-grade-slider__caption">
        Drag slider horizontally to inspect ACES color transformation, halation bloom, and grain curves.
      </div>
    </div>
  )
}
