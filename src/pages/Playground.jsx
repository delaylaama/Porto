import { useState } from 'react'
import TiltCard from '../components/TiltCard'
import CaseStudyModal from '../components/CaseStudyModal'
import Footer from '../components/Footer'
import { portfolioProjects } from '../data/projects'
import './Playground.css'

export default function Playground() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const playgroundProjects = portfolioProjects.filter(p => p.type === 'playground')

  const extraItems = [
    {
      id: 201,
      title: 'Procedural Noise Topology',
      category: '3D Experiment',
      tags: ['Blender 4.2', 'Geometry Nodes'],
      image: 'https://picsum.photos/seed/noise-topology/800/600',
      color: '#76d600',
      colorBg: '#f2fce2',
      year: '2026',
      client: 'Self-Initiated R&D',
      overview: 'Investigating real-time displacement terrain shaders using simplex noise octaves in Blender geometry nodes.'
    },
    {
      id: 202,
      title: 'Glitch Typographic Kinetic',
      category: 'Motion Test',
      tags: ['After Effects', 'Expressions'],
      image: 'https://picsum.photos/seed/glitch-kinetic/800/600',
      color: '#0066ff',
      colorBg: '#eff6ff',
      year: '2024',
      client: 'Self-Initiated R&D',
      overview: 'Variable font weight modulation triggered by dynamic audio amplitude markers in After Effects.'
    },
    {
      id: 203,
      title: 'Volumetric Fluid Dynamics',
      category: '3D Experiment',
      tags: ['Blender', 'Cycles'],
      image: 'https://picsum.photos/seed/fluid-dynamics/800/600',
      color: '#9333ea',
      colorBg: '#f5f3ff',
      year: '2024',
      client: 'Self-Initiated R&D',
      overview: 'High-density micro-particle smoke simulations interacting with invisible collision meshes.'
    },
    {
      id: 204,
      title: 'Kodak 5219 Print Emulation',
      category: 'Color Science',
      tags: ['DaVinci Resolve', 'ACES'],
      image: 'https://picsum.photos/seed/kodak-5219/800/600',
      color: '#ff8c00',
      colorBg: '#fffbeb',
      year: '2024',
      client: 'Self-Initiated R&D',
      overview: 'Mathematical modeling of optical halation curves and subtractive color density in 35mm motion picture film.'
    }
  ]

  const allItems = [...playgroundProjects, ...extraItems]

  const handleOpenCaseStudy = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  return (
    <div className="playground-page">
      {/* ── LAB HERO ── */}
      <section className="playground-hero">
        <div className="playground-hero__inner">
          <div className="playground-hero__eyebrow">
            <span className="playground-hero__tag">INDEX 03 // THE LAB</span>
            <span className="playground-hero__sep">•</span>
            <span className="playground-hero__count">{allItems.length} R&amp;D Studies</span>
          </div>

          <div className="playground-hero__heading-box">
            <h1 className="playground-hero__title">
              The Lab
              <span className="playground-hero__title-serif">— raw creative explorations</span>
            </h1>
            <p className="playground-hero__desc">
              Daily motion sketches, procedural shader experiments, and computational typography. 
              The boundary-free creative playground where commercial techniques are discovered and refined.
            </p>
          </div>
        </div>
      </section>

      {/* ── LAB GALLERY ── */}
      <section className="playground-content">
        <div className="playground-content__inner">
          <div className="playground-note">
            <span className="playground-note__icon">✦</span>
            <p>Unconstrained R&amp;D explorations — where technical curiosity meets pure artistic instinct.</p>
          </div>

          <div className="playground-grid">
            {allItems.map((project, idx) => (
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

      {/* Case Study Lightbox */}
      <CaseStudyModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Footer />
    </div>
  )
}
