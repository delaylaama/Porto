import { useState } from 'react'
import TiltCard from '../components/TiltCard'
import CaseStudyModal from '../components/CaseStudyModal'
import Footer from '../components/Footer'
import { portfolioProjects } from '../data/projects'
import './Portfolio.css'

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = ['All', 'Virtual Production', 'Motion Design', '3D Art', 'Video Edit']

  const filtered = activeFilter === 'All'
    ? portfolioProjects
    : portfolioProjects.filter(p => p.category === activeFilter)

  const handleOpenCaseStudy = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="portfolio-page">
      {/* ── EDITORIAL PAGE HEADER ── */}
      <section className="portfolio-hero">
        <div className="portfolio-hero__inner">
          <div className="portfolio-hero__eyebrow">
            <span className="portfolio-hero__tag">INDEX 02 // SELECTED WORKS</span>
            <span className="portfolio-hero__sep">•</span>
            <span className="portfolio-hero__count">{filtered.length} Flagship Projects</span>
          </div>

          <div className="portfolio-hero__heading-box">
            <h1 className="portfolio-hero__title">
              Curated Portfolio
              <span className="portfolio-hero__title-serif">— direction &amp; motion systems</span>
            </h1>
            <p className="portfolio-hero__desc">
              Commercial films, virtual production campaigns, tour visualizers, and procedural 3D environments. 
              Click any project to explore the full creative treatment, look development styleframes, and production toolchain.
            </p>
          </div>
        </div>
      </section>

      {/* ── FILTER & GALLERY SECTION ── */}
      <section className="portfolio-content">
        <div className="portfolio-content__inner">
          {/* Category Filter Pills */}
          <div className="portfolio-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`portfolio-filter-btn ${activeFilter === cat ? 'portfolio-filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project Grid with Tri-Fusion Tilt Cards */}
          <div className="portfolio-grid">
            {filtered.map((project, idx) => (
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

      {/* Fullscreen Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  )
}
