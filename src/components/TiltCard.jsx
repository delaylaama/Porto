import { useRef, useState } from 'react'
import CardShaderImage from './CardShaderImage'
import './TiltCard.css'

export default function TiltCard({ 
  project, 
  image, 
  title, 
  category, 
  tags = [], 
  year, 
  onClick, 
  index = 0,
  client,
  color,
  colorBg
}) {
  const cardRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [mouseUv, setMouseUv] = useState({ x: 0.5, y: 0.5 })

  const displayImage = image || project?.image
  const displayTitle = title || project?.title
  const displayCategory = category || project?.category
  const displayTags = tags.length > 0 ? tags : (project?.tags || [])
  const displayYear = year || project?.year
  const displayClient = client || project?.client
  const cardColor = color || project?.color || '#ff2a5f'
  const cardColorBg = colorBg || project?.colorBg || '#fff1f2'

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Slight, refined 3D tilt applied directly via CSS vars for 120fps smooth performance
    const rotateX = ((y - centerY) / centerY) * -7
    const rotateY = ((x - centerX) / centerX) * 7

    cardRef.current.style.setProperty('--rotateX', `${rotateX}deg`)
    cardRef.current.style.setProperty('--rotateY', `${rotateY}deg`)
    cardRef.current.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`)
    cardRef.current.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`)

    // UV coordinates for the WebGL shader plane [0..1]
    const u = Math.max(0, Math.min(1, x / rect.width))
    const v = Math.max(0, Math.min(1, 1 - y / rect.height))
    setMouseUv({ x: u, y: v })
  }

  const handleMouseEnter = () => setIsHovered(true)

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (cardRef.current) {
      cardRef.current.style.setProperty('--rotateX', '0deg')
      cardRef.current.style.setProperty('--rotateY', '0deg')
    }
  }

  return (
    <div 
      className={`tilt-card-wrapper ${isHovered ? 'tilt-card-wrapper--hovered' : ''}`}
      data-cursor-text="VIEW"
      style={{
        '--card-color': cardColor,
        '--card-color-bg': cardColorBg,
        '--delay': `${index * 60}ms`,
      }}
    >
      {/* ── COMIC HALFTONE DROP SHADOW BOTTOM LAYER ── */}
      <div className="tilt-card__halftone-shadow" aria-hidden="true">
        <div className="tilt-card__halftone-pattern" />
      </div>

      {/* ── FOREGROUND 3D TILTING CARD ── */}
      <div
        ref={cardRef}
        className={`tilt-card ${isHovered ? 'tilt-card--hovered' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => onClick && onClick(project)}
        data-cursor="pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick && onClick(project)
          }
        }}
      >
        {/* Futuristic Glowing Neon Accent Rim */}
        <div className="tilt-card__color-rim" />

        {/* Media Frame with R3F WebGL Shader Distortion */}
        <div className="tilt-card__image-wrapper">
          <CardShaderImage
            src={displayImage}
            alt={displayTitle}
            isHovered={isHovered}
            mouseUv={mouseUv}
            className="tilt-card__image"
          />
          <div className="tilt-card__image-gradient" />
          <div className="tilt-card__glare" />

          {/* Futuristic Top Bar Badges */}
          <div className="tilt-card__top-bar">
            <span className="tilt-card__category-badge">{displayCategory}</span>
            {displayYear && <span className="tilt-card__year-badge">{displayYear}</span>}
          </div>

          {/* Hover Inspect Case Study Action Pill */}
          <div className="tilt-card__inspect-pill">
            <span className="tilt-card__inspect-dot" />
            <span>Case Study</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Editorial Content Block (Light Theme) */}
        <div className="tilt-card__content">
          <div className="tilt-card__meta-row">
            {displayClient && (
              <span className="tilt-card__client">{displayClient}</span>
            )}
            <span className="tilt-card__accent-bar" />
          </div>

          <h3 className="tilt-card__title">{displayTitle}</h3>

          {displayTags.length > 0 && (
            <div className="tilt-card__tags">
              {displayTags.slice(0, 3).map((tag) => (
                <span key={tag} className="tilt-card__tag">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Spider-Verse Ink Corner Marks */}
        <div className="tilt-card__corner tilt-card__corner--tl" />
        <div className="tilt-card__corner tilt-card__corner--tr" />
        <div className="tilt-card__corner tilt-card__corner--bl" />
        <div className="tilt-card__corner tilt-card__corner--br" />
      </div>
    </div>
  )
}
