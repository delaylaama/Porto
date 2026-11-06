import { useEffect, useRef } from 'react'
import { playTick } from '../utils/audioSystem'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const textRef = useRef(null)
  const pos = useRef({ x: -100, y: -100 })
  const target = useRef({ x: -100, y: -100 })
  const isHovering = useRef(false)
  const activeLabel = useRef('')
  const lastTargetRef = useRef(null)

  useEffect(() => {
    // Only show custom cursor on desktop
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return

    const onMove = (e) => {
      target.current = { x: e.clientX, y: e.clientY }
      // Instant zero-lag tracking for the center dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }

      // Avoid redundant DOM tree lookups if cursor is over the same node
      if (e.target !== lastTargetRef.current) {
        lastTargetRef.current = e.target

        const hoveredWithText = e.target.closest ? e.target.closest('[data-cursor-text]') : null
        const newLabel = hoveredWithText ? (hoveredWithText.getAttribute('data-cursor-text') || '') : ''
        
        if (newLabel !== activeLabel.current && newLabel) {
          playTick(1.1)
        }
        activeLabel.current = newLabel

        const interactive = e.target.closest ? e.target.closest('a, button, [data-cursor="pointer"], input, select, textarea, [data-cursor-text]') : null
        const willHover = !!interactive
        if (willHover && !isHovering.current) {
          playTick(0.95)
        }
        isHovering.current = willHover
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.classList.add('custom-cursor-active')

    let rafId
    const lerp = (a, b, f) => a + (b - a) * f

    const animate = () => {
      // Snappy and crisp 0.35 lerp for the ring follower
      pos.current.x = lerp(pos.current.x, target.current.x, 0.35)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.35)

      if (ringRef.current) {
        const hasText = !!activeLabel.current

        if (hasText) {
          ringRef.current.classList.add('cursor-ring--text')
          ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
          if (textRef.current && textRef.current.textContent !== activeLabel.current) {
            textRef.current.textContent = activeLabel.current
          }
          if (dotRef.current) dotRef.current.style.opacity = '0'
        } else {
          ringRef.current.classList.remove('cursor-ring--text')
          if (dotRef.current) dotRef.current.style.opacity = '1'

          const scale = isHovering.current ? 1.75 : 1
          ringRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${scale})`
          ringRef.current.style.borderColor = isHovering.current ? '#008dd5' : 'rgba(18, 19, 19, 0.5)'
          ringRef.current.style.backgroundColor = isHovering.current ? 'rgba(0, 141, 213, 0.08)' : 'transparent'
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={textRef} className="cursor-ring__label" />
      </div>
    </>
  )
}
