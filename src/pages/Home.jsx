import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import TiltCard from '../components/TiltCard'
import CaseStudyModal from '../components/CaseStudyModal'
import ColorGradeSlider from '../components/ColorGradeSlider'
import MultiPassViewer from '../components/MultiPassViewer'
import Timecode from '../components/Timecode'
import Footer from '../components/Footer'
import { portfolioProjects, disciplines } from '../data/projects'
import { setSpatialAudio } from '../utils/audioSystem'
import './Home.css'

const HeroScene = lazy(() => import('../components/HeroScene'))

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const marqueeTrackRef = useRef(null)

  const featuredProjects = portfolioProjects.filter(p => p.featured)
  const flagshipProject = portfolioProjects[0] // Synapse Zero

  // Marquee acceleration tracking based on scroll velocity
  useEffect(() => {
    let lastScroll = window.scrollY
    let velocity = 0
    let rafId

    const onScroll = () => {
      const currentScroll = window.scrollY
      const delta = Math.abs(currentScroll - lastScroll)
      velocity = Math.min(delta * 0.12, 5)
      lastScroll = currentScroll
    }

    const updateMarquee = () => {
      if (marqueeTrackRef.current) {
        const speed = Math.max(5, 25 / (1 + velocity))
        marqueeTrackRef.current.style.animationDuration = `${speed}s`
      }
      velocity *= 0.94
      rafId = requestAnimationFrame(updateMarquee)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(updateMarquee)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  // Masked headline reveals on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.mask-line-inner').forEach((line, idx) => {
              line.style.transitionDelay = `${idx * 0.14}s`
              line.classList.add('revealed')
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.mask-headline').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Editor keyboard navigation: J/K/L and Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in form field or modal is open
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || isModalOpen) {
        return
      }

      const key = e.key.toLowerCase()

      if (key === ' ' || e.code === 'Space') {
        e.preventDefault()
        handlePlayReel()
        return
      }

      const sections = ['hero', 'showreel-stage', 'breakdown-archive']
      const currentScroll = window.scrollY
      
      const sectionPositions = sections.map(id => {
        const el = document.getElementById(id)
        return { id, top: el ? el.offsetTop : 0 }
      })

      let currentIndex = 0
      for (let i = 0; i < sectionPositions.length; i++) {
        if (currentScroll >= sectionPositions[i].top - 150) {
          currentIndex = i
        }
      }

      if (key === 'j') {
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1)
        const targetEl = document.getElementById(sections[nextIndex])
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
      } else if (key === 'k') {
        const prevIndex = Math.max(currentIndex - 1, 0)
        const targetEl = document.getElementById(sections[prevIndex])
        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' })
      } else if (key === 'l') {
        const archiveEl = document.getElementById('breakdown-archive')
        if (archiveEl) archiveEl.scrollIntoView({ behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const handleOpenCaseStudy = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleToggleSound = (e) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    setSpatialAudio(!nextMuted)
  }

  const handlePlayReel = () => {
    handleOpenCaseStudy(flagshipProject)
  }

  const handleScrollToReveal = () => {
    const showreelEl = document.getElementById('showreel-stage')
    if (showreelEl) {
      showreelEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleScrollToArchive = (e) => {
    e.stopPropagation()
    const archiveEl = document.getElementById('breakdown-archive')
    if (archiveEl) {
      archiveEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="home-page">
      {/* ── 1. INITIAL LANDING PAGE: VAST WHITE BREATHING SPACE ── */}
      <section className="hero-landing-space" id="hero" aria-label="Hero Introduction">
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
        {/* Editorial Corner Markers */}
        <div className="hero-landing__corner hero-landing__corner--tl" aria-hidden="true">
          <span className="hero-landing__coord">[12.9716° N, 77.5946° E]</span>
          <span className="hero-landing__sublabel">Available Worldwide</span>
        </div>

        <div className="hero-landing__corner hero-landing__corner--tr" aria-hidden="true">
          <span className="hero-landing__badge-live">
            <span className="hero-landing__live-dot" />
            Taking Commissions
          </span>
          <span className="hero-landing__sublabel">Q3 / Q4 2026</span>
        </div>

        <div className="hero-landing__corner hero-landing__corner--bl" aria-hidden="true">
          <span className="hero-landing__coord">DISCIPLINES // 04</span>
          <span className="hero-landing__sublabel">Editing • Motion • 3D • Color</span>
        </div>

        <div className="hero-landing__corner hero-landing__corner--br" aria-hidden="true">
          <span className="hero-landing__coord">TIMELINE // 02:44</span>
          <span className="hero-landing__sublabel">4K ProRes 4444 XQ</span>
        </div>

        {/* Centerpiece Typographic Lockup with Expansive Breathing Room */}
        <div className="hero-landing__center">
          <div className="hero-landing__eyebrow">
            <span className="hero-landing__dot" />
            <span>PORTFOLIO // CREATIVE DIRECTION • MOTION • 3D</span>
          </div>

          <h1 className="hero-landing__name" data-text="THEJAS">
            THEJAS
          </h1>

          <div className="hero-landing__role">
            <span className="hero-landing__role-sans">Video Editor</span>
            <span className="hero-landing__role-amp">&amp;</span>
            <span className="hero-landing__role-serif">3D Motion Generalist</span>
          </div>

          <p className="hero-landing__disciplines">
            Sculpting visual velocity, procedural 3D environments &amp; calibrated film color science.
          </p>

          <div className="hero-landing__pills">
            <span className="hero-landing__pill">Premiere Pro</span>
            <span className="hero-landing__pill">After Effects</span>
            <span className="hero-landing__pill">Blender 4.2</span>
            <span className="hero-landing__pill">Unreal Engine 5</span>
            <span className="hero-landing__pill">DaVinci Resolve</span>
          </div>
        </div>

        {/* Interactive Scroll To Reveal Cue at Bottom */}
        <button 
          className="hero-landing__scroll-cue btn-interactive"
          onClick={handleScrollToReveal}
          aria-label="Scroll down to full-page showreel"
        >
          <span className="hero-landing__scroll-text">SCROLL TO REVEAL SHOWREEL</span>
          <div className="hero-landing__scroll-mouse">
            <span className="hero-landing__scroll-wheel" />
          </div>
          <span className="hero-landing__scroll-arrow">↓</span>
        </button>
      </section>

      {/* ── 2. FULL-PAGE SHOWREEL THEATRE (100vh FULL BLEED) ── */}
      <section 
        className="fullpage-showreel-section" 
        id="showreel-stage"
        onClick={handlePlayReel}
        role="button"
        tabIndex={0}
        aria-label="Launch Fullscreen Master Showreel"
        data-cursor-text="PLAY"
      >
        {/* Full-bleed background media */}
        <div className="fullpage-showreel__backdrop">
          <img 
            src="https://picsum.photos/seed/cinemareel/1920/1080" 
            alt="Cinematic Showreel Master Frame" 
            className="fullpage-showreel__img"
          />
          <div className="fullpage-showreel__overlay" />
          <div className="fullpage-showreel__scanlines" />
        </div>

        {/* Top Telemetry Bar */}
        <div className="fullpage-showreel__header">
          <div className="fullpage-showreel__telemetry-left">
            <span className="fullpage-showreel__red-dot" />
            <span className="fullpage-showreel__res">4K PRORES 4444 XQ</span>
            <span className="fullpage-showreel__sep">/</span>
            <span className="fullpage-showreel__tc"><Timecode /></span>
          </div>

          <div className="fullpage-showreel__badge-pill">
            GENERALIST SHOWREEL 2026 // THEJAS
          </div>

          <div className="fullpage-showreel__telemetry-right">
            <span className="fullpage-showreel__aspect">2.39:1 CINEMASCOPE</span>
            <span className="fullpage-showreel__shortcut-hint">[J/K/L] NAV • [SPACE] PLAY</span>
            <button 
              className="fullpage-showreel__audio-btn btn-interactive"
              onClick={handleToggleSound}
              aria-label="Toggle spatial audio"
            >
              <span>{isMuted ? '🔇' : '🔊'}</span>
              <span>{isMuted ? 'Muted' : 'Spatial 48kHz'}</span>
            </button>
          </div>
        </div>

        {/* Center Magnetic Play Trigger */}
        <div className="fullpage-showreel__center">
          <div className="fullpage-showreel__play-disc">
            <div className="fullpage-showreel__play-glow" />
            <div className="fullpage-showreel__play-btn">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
          <div className="fullpage-showreel__center-text">
            <span className="fullpage-showreel__center-cue">CLICK ANYWHERE TO PLAY REEL</span>
            <h2 className="fullpage-showreel__center-title">Direction · Motion · 3D CGI</h2>
          </div>
        </div>

        {/* Bottom Full-Bleed Timeline Scrubber Strip */}
        <div className="fullpage-showreel__footer">
          <div className="fullpage-showreel__chapter">
            <span className="fullpage-showreel__chap-label">CHAPTER 01:</span>
            <strong className="fullpage-showreel__chap-name">Realtime Virtual Production &amp; Worldbuilding</strong>
          </div>

          <div className="fullpage-showreel__tech-strip">
            <span>DAVINCI RESOLVE YRGB</span>
            <span className="fullpage-showreel__dot-sep">•</span>
            <span>UNREAL ENGINE 5.4</span>
            <span className="fullpage-showreel__dot-sep">•</span>
            <span>59.94 FPS MASTER</span>
          </div>

          <div 
            className="fullpage-showreel__next-cue btn-interactive" 
            onClick={handleScrollToArchive}
            role="button"
            tabIndex={0}
          >
            <span>EXPLORE CRAFT &amp; ARCHIVE</span>
            <span className="fullpage-showreel__next-arrow">↓</span>
          </div>
        </div>
      </section>

      {/* ── 3. REVEALED ARCHIVE: INTERACTIVE BREAKDOWN & PROJECTS ── */}
      <div className="home-revealed-content" id="breakdown-archive">
        {/* Marquee Ticker Threshold with velocity acceleration */}
        <div className="reveal-ticker" aria-hidden="true">
          <div ref={marqueeTrackRef} className="reveal-ticker__track">
            <span>SHOWREEL 2026 // DIRECTION • MOTION • 3D • EDITING • COLOR SCIENCE // THEJAS STUDIO</span>
            <span>SHOWREEL 2026 // DIRECTION • MOTION • 3D • EDITING • COLOR SCIENCE // THEJAS STUDIO</span>
            <span>SHOWREEL 2026 // DIRECTION • MOTION • 3D • EDITING • COLOR SCIENCE // THEJAS STUDIO</span>
          </div>
        </div>

        {/* Editorial Statement Header */}
        <section className="reveal-intro-section">
          <div className="reveal-intro__inner">
            <div className="reveal-intro__col-left">
              <span className="reveal-intro__tag">INDEX // 01 REEL &amp; ARCHIVE</span>
              <h2 className="reveal-intro__h2 mask-headline">
                <span className="mask-line-wrap">
                  <span className="mask-line-inner">Sculpting visual velocity</span>
                </span>
                <span className="mask-line-wrap">
                  <span className="mask-line-inner reveal-intro__h2-serif">&amp; dimensional worlds.</span>
                </span>
              </h2>
            </div>
            <div className="reveal-intro__col-right">
              <p className="reveal-intro__body">
                Bridging kinetic typography, raw editing rhythm, and photoreal 3D worldbuilding. 
                Every cut is calibrated for brands demanding timeless cultural gravity and uncompromising craft.
              </p>
              <div className="reveal-intro__metrics">
                <div className="reveal-intro__metric">
                  <span className="reveal-intro__metric-num">08+</span>
                  <span className="reveal-intro__metric-label">Years In Motion</span>
                </div>
                <div className="reveal-intro__metric">
                  <span className="reveal-intro__metric-num">4K/8K</span>
                  <span className="reveal-intro__metric-label">Master Delivery</span>
                </div>
                <div className="reveal-intro__metric">
                  <span className="reveal-intro__metric-num">100%</span>
                  <span className="reveal-intro__metric-label">Bespoke Direction</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. INTERACTIVE BREAKDOWN LAB: LIVE WIPE & MULTI-PASS ── */}
        <section className="interactive-lab-section">
          <div className="interactive-lab__inner">
            <div className="interactive-lab__header">
              <span className="interactive-lab__tag">TECHNICAL CRAFT &amp; WORKFLOW</span>
              <h2 className="interactive-lab__title">Behind the Master Timeline</h2>
              <p className="interactive-lab__desc">
                Interact with the raw components of production. Drag the color slider to inspect DaVinci Resolve 
                ACES grading, and toggle the 3D passes to inspect mesh topology and lighting.
              </p>
            </div>

            <div className="interactive-lab__grid">
              {/* Color Grading Wipe Slider */}
              <div className="interactive-lab__item">
                <ColorGradeSlider 
                  logImage={flagshipProject.grading.log}
                  gradeImage={flagshipProject.grading.grade}
                  label="DaVinci Resolve Color Science // ARRI LogC3 ↔ Kodak 2383 Film Print"
                />
              </div>

              {/* Multi-Pass 3D Viewer */}
              <div className="interactive-lab__item">
                <MultiPassViewer 
                  passes={flagshipProject.passes}
                  title="Unreal 5 &amp; Blender // Wireframe ↔ Clay AO ↔ Final Composite"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. SELECTED FEATURED WORKS (COMIC HALFTONE CARDS) ── */}
        <section className="featured-work-section">
          <div className="featured-work-section__inner">
            <div className="featured-work-section__header">
              <div>
                <span className="featured-work-section__tag">02 // SELECTED CASE STUDIES</span>
                <h2 className="featured-work-section__title">Flagship Projects</h2>
              </div>
              <Link to="/portfolio" className="featured-work-section__all-link">
                <span>Explore Complete Archive (08)</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="featured-work-grid">
              {featuredProjects.map((project, idx) => (
                <TiltCard
                  key={project.id}
                  project={project}
                  index={idx}
                  onClick={handleOpenCaseStudy}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. THE DISCIPLINE MATRIX ── */}
        <section className="disciplines-section">
          <div className="disciplines-section__inner">
            <div className="disciplines-section__header">
              <div>
                <span className="disciplines-section__tag">03 // PRODUCTION ARSENAL</span>
                <h2 className="disciplines-section__title">The Discipline Matrix</h2>
              </div>
              <p className="disciplines-section__desc">
                Tactile craft across four foundational pillars. Each medium represents complete end-to-end 
                readiness from initial creative treatment to final master delivery.
              </p>
            </div>

            <div className="disciplines-grid">
              {disciplines.map((item) => (
                <div key={item.id} className="discipline-card">
                  <div className="discipline-card__top">
                    <span className="discipline-card__id">{item.id}</span>
                    <span className="discipline-card__cat">{item.category}</span>
                  </div>
                  <h3 className="discipline-card__title">{item.title}</h3>
                  <p className="discipline-card__desc">{item.description}</p>

                  <div className="discipline-card__frame">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  <div className="discipline-card__tools">
                    {item.tools.map((tool) => (
                      <span key={tool} className="discipline-card__tool-tag">{tool}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. INVITATION BANNER ── */}
        <section className="invitation-banner">
          <div className="invitation-banner__inner">
            <span className="invitation-banner__status">Currently Scheduling Commissions: Q3 / Q4</span>
            <h2 className="invitation-banner__title">
              Have a vision in motion?
              <span className="invitation-banner__title-serif">Let’s talk frames.</span>
            </h2>
            <p className="invitation-banner__desc">
              Whether you need an end-to-end commercial director, a procedural 3D worldbuilder in Unreal 5, 
              or an editor with surgical color chops — send your brief or treatment.
            </p>

            <div className="invitation-banner__actions">
              <Link to="/commissioned" className="invitation-banner__primary-btn">
                <span>Initiate Project Commission</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link to="/shop" className="invitation-banner__secondary-btn">
                Explore Studio Atelier
              </Link>
            </div>

            <div className="invitation-banner__footer-note">
              <span>Direct Inquiries: studio@thejas-motion.xyz</span>
              <span className="invitation-banner__sep">•</span>
              <span>Typical response within 24 hours</span>
            </div>
          </div>
        </section>
      </div>

      {/* Fullscreen Case Study Modal with Sub-Pages */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  )
}
