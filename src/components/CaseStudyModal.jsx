import { useEffect, useState } from 'react'
import ColorGradeSlider from './ColorGradeSlider'
import MultiPassViewer from './MultiPassViewer'
import './CaseStudyModal.css'

export default function CaseStudyModal({ project, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isOpen) {
      setActiveTab('overview')
      return
    }

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

  if (!isOpen || !project) return null

  return (
    <div className="case-study-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="case-study-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="case-study-modal__header">
          <div className="case-study-modal__breadcrumbs">
            <span className="case-study-modal__tag">{project.category}</span>
            <span className="case-study-modal__sep">/</span>
            <span className="case-study-modal__client">{project.client}</span>
            <span className="case-study-modal__sep">/</span>
            <span className="case-study-modal__year">{project.year}</span>
          </div>

          <button 
            className="case-study-modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <span className="case-study-modal__close-text">ESC</span>
            <span className="case-study-modal__close-icon">✕</span>
          </button>
        </div>

        {/* Sub-Tabs: Pages within Pages */}
        <div className="case-study-modal__subtabs">
          <button 
            className={`case-study-tab ${activeTab === 'overview' ? 'case-study-tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            01 // Overview
          </button>

          {project.hasMultiPass && (
            <button 
              className={`case-study-tab ${activeTab === 'passes' ? 'case-study-tab--active' : ''}`}
              onClick={() => setActiveTab('passes')}
            >
              02 // 3D Multi-Pass
            </button>
          )}

          {project.hasColorGrade && (
            <button 
              className={`case-study-tab ${activeTab === 'grading' ? 'case-study-tab--active' : ''}`}
              onClick={() => setActiveTab('grading')}
            >
              03 // Color Science
            </button>
          )}

          {project.styleframes && project.styleframes.length > 0 && (
            <button 
              className={`case-study-tab ${activeTab === 'styleframes' ? 'case-study-tab--active' : ''}`}
              onClick={() => setActiveTab('styleframes')}
            >
              04 // Styleframes
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="case-study-modal__body">
          {activeTab === 'overview' && (
            <>
              {/* Hero Frame */}
              <div className="case-study-modal__hero-viewport">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="case-study-modal__hero-img"
                />
                <div className="case-study-modal__hero-overlay">
                  <div className="case-study-modal__hero-badge">
                    <span className="case-study-modal__pulse-dot" />
                    <span>4K DCI MASTER REEL</span>
                  </div>
                  <div className="case-study-modal__hero-title-box">
                    <h1 className="case-study-modal__title">{project.title}</h1>
                    <p className="case-study-modal__subtitle">{project.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Highlight Quote */}
              {project.highlightQuote && (
                <div className="case-study-modal__quote-block">
                  <blockquote className="case-study-modal__quote">
                    {project.highlightQuote}
                  </blockquote>
                </div>
              )}

              {/* Narrative Grid */}
              <div className="case-study-modal__grid">
                <div className="case-study-modal__narrative">
                  <section className="case-study-modal__section">
                    <h2 className="case-study-modal__section-heading">Overview</h2>
                    <p className="case-study-modal__text">{project.overview || project.description}</p>
                  </section>

                  {project.challenge && (
                    <section className="case-study-modal__section">
                      <h2 className="case-study-modal__section-heading">The Creative Challenge</h2>
                      <p className="case-study-modal__text">{project.challenge}</p>
                    </section>
                  )}

                  {project.solution && (
                    <section className="case-study-modal__section">
                      <h2 className="case-study-modal__section-heading">Execution &amp; Solution</h2>
                      <p className="case-study-modal__text">{project.solution}</p>
                    </section>
                  )}
                </div>

                {/* Sidebar */}
                <aside className="case-study-modal__sidebar">
                  <div className="case-study-modal__meta-card">
                    <div className="case-study-modal__meta-item">
                      <span className="case-study-modal__meta-label">Client</span>
                      <span className="case-study-modal__meta-value">{project.client}</span>
                    </div>
                    <div className="case-study-modal__meta-item">
                      <span className="case-study-modal__meta-label">Role</span>
                      <span className="case-study-modal__meta-value">{project.role || 'Direction & 3D'}</span>
                    </div>
                    <div className="case-study-modal__meta-item">
                      <span className="case-study-modal__meta-label">Year</span>
                      <span className="case-study-modal__meta-value">{project.year}</span>
                    </div>
                    <div className="case-study-modal__meta-item">
                      <span className="case-study-modal__meta-label">Duration</span>
                      <span className="case-study-modal__meta-value">{project.duration || 'Commercial Cut'}</span>
                    </div>

                    <div className="case-study-modal__meta-divider" />

                    <div className="case-study-modal__meta-item">
                      <span className="case-study-modal__meta-label">Toolchain</span>
                      <div className="case-study-modal__tool-tags">
                        {(project.toolchain || project.tags).map((tool) => (
                          <span key={tool} className="case-study-modal__tool-pill">{tool}</span>
                        ))}
                      </div>
                    </div>

                    {project.deliverables && (
                      <>
                        <div className="case-study-modal__meta-divider" />
                        <div className="case-study-modal__meta-item">
                          <span className="case-study-modal__meta-label">Deliverables</span>
                          <ul className="case-study-modal__deliverables-list">
                            {project.deliverables.map((deliv, i) => (
                              <li key={i}>
                                <span className="case-study-modal__bullet">◆</span>
                                <span>{deliv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>
                </aside>
              </div>
            </>
          )}

          {activeTab === 'passes' && project.hasMultiPass && (
            <div className="case-study-modal__subview">
              <MultiPassViewer 
                passes={project.passes} 
                title={`${project.title} — 3D Render Passes & Mesh Topology`} 
              />
            </div>
          )}

          {activeTab === 'grading' && project.hasColorGrade && (
            <div className="case-study-modal__subview">
              <ColorGradeSlider 
                logImage={project.grading.log}
                gradeImage={project.grading.grade}
                label={`${project.title} — DaVinci Resolve CST Color Science`}
              />
            </div>
          )}

          {activeTab === 'styleframes' && project.styleframes && (
            <div className="case-study-modal__subview">
              <div className="case-study-modal__styleframes-expanded">
                {project.styleframes.map((frame, idx) => (
                  <div key={idx} className="case-study-modal__frame-card-lg">
                    <img src={frame} alt={`Styleframe ${idx + 1}`} loading="lazy" />
                    <span className="case-study-modal__frame-label">LookDev Study 0{idx + 1} // Final Color Pass</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="case-study-modal__footer">
          <span className="case-study-modal__footer-note">
            Interested in directing or motion design for a similar project?
          </span>
          <a href="mailto:thejas.motion@gmail.com" className="case-study-modal__inquire-btn">
            Inquire About This Style →
          </a>
        </div>
      </div>
    </div>
  )
}
