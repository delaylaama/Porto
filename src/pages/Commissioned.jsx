import { useState } from 'react'
import TiltCard from '../components/TiltCard'
import CaseStudyModal from '../components/CaseStudyModal'
import Footer from '../components/Footer'
import { portfolioProjects } from '../data/projects'
import './Commissioned.css'

export default function Commissioned() {
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    discipline: 'Commercial Direction & 3D',
    timeline: 'Within 4-6 Weeks',
    budget: '$5,000 - $15,000',
    brief: ''
  })

  const commissionedProjects = portfolioProjects.filter(p => p.type === 'commissioned' || p.client !== 'Personal')

  const handleOpenCaseStudy = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  return (
    <div className="commissioned-page">
      {/* ── COMMISSIONS HERO ── */}
      <section className="commissions-hero">
        <div className="commissions-hero__inner">
          <div className="commissions-hero__eyebrow">
            <span className="commissions-hero__tag">INDEX 04 // COMMISSIONS</span>
            <span className="commissions-hero__sep">•</span>
            <span className="commissions-hero__status">CURRENT AVAILABILITY: ACTIVE Q3/Q4</span>
          </div>

          <div className="commissions-hero__heading-box">
            <h1 className="commissions-hero__title">
              Commercial Direction
              <span className="commissions-hero__title-serif">&amp; bespoke commissions</span>
            </h1>
            <p className="commissions-hero__desc">
              Directing commercials, virtual production campaigns, title identities, and concert visuals. 
              Partnering directly with progressive brands, record labels, and creative agencies worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRODUCTION PROCESS PIPELINE ── */}
      <section className="process-pipeline-section">
        <div className="process-pipeline-section__inner">
          <div className="process-pipeline__header">
            <span className="process-pipeline__tag">METHODOLOGY</span>
            <h2 className="process-pipeline__title">The Production Pipeline</h2>
          </div>

          <div className="process-pipeline__grid">
            <div className="process-card">
              <span className="process-card__step">01</span>
              <h3 className="process-card__title">Treatment &amp; Vision</h3>
              <p className="process-card__desc">
                Deconstructing your brief into mood films, motion references, and narrative pacing treatments. 
                Establishing visual gravity before touching software.
              </p>
            </div>

            <div className="process-card">
              <span className="process-card__step">02</span>
              <h3 className="process-card__title">Styleframes &amp; R&amp;D</h3>
              <p className="process-card__desc">
                High-fidelity 3D look development, lighting studies, and typography tests. Defining the color palette 
                and camera language.
              </p>
            </div>

            <div className="process-card">
              <span className="process-card__step">03</span>
              <h3 className="process-card__title">Realtime &amp; Compositing</h3>
              <p className="process-card__desc">
                Unreal Engine 5 sequencing, procedural Blender geometry nodes, and 32-bit linear comping in After Effects 
                with audio synchronization.
              </p>
            </div>

            <div className="process-card">
              <span className="process-card__step">04</span>
              <h3 className="process-card__title">Color &amp; Master Delivery</h3>
              <p className="process-card__desc">
                DaVinci Resolve ACES color grading, custom 35mm film halation transforms, and 4K/8K multi-format 
                deliverables ready for broadcast or arena.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMISSIONED WORKS ARCHIVE ── */}
      <section className="commissioned-works-section">
        <div className="commissioned-works-section__inner">
          <div className="commissioned-works__header">
            <span className="commissioned-works__tag">COLLABORATIONS</span>
            <h2 className="commissioned-works__title">Selected Client Works</h2>
          </div>

          <div className="commissioned-grid">
            {commissionedProjects.map((project, idx) => (
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

      {/* ── TREATMENT BRIEF INQUIRY FORM ── */}
      <section className="brief-inquiry-section">
        <div className="brief-inquiry-section__inner">
          <div className="brief-inquiry__header">
            <span className="brief-inquiry__tag">INITIATE COLLABORATION</span>
            <h2 className="brief-inquiry__title">Submit Project Brief</h2>
            <p className="brief-inquiry__desc">
              Have an upcoming release, commercial launch, or spatial installation? 
              Share your timeline and parameters below.
            </p>
          </div>

          {formSubmitted ? (
            <div className="brief-inquiry__success">
              <div className="brief-inquiry__success-badge">✓</div>
              <h3 className="brief-inquiry__success-title">Brief Received</h3>
              <p className="brief-inquiry__success-text">
                Thank you. We review all treatment requests carefully and will reply with availability and initial thoughts within 24 hours.
              </p>
            </div>
          ) : (
            <form className="brief-inquiry__form" onSubmit={handleSubmit}>
              <div className="brief-inquiry__form-row">
                <div className="brief-inquiry__field">
                  <label htmlFor="name">Your Name / Agency</label>
                  <input
                    type="text"
                    id="name"
                    required
                    placeholder="e.g. Alex Vance, Studio Apex"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="brief-inquiry__field">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    placeholder="contact@agency.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="brief-inquiry__form-row">
                <div className="brief-inquiry__field">
                  <label htmlFor="discipline">Primary Discipline</label>
                  <select
                    id="discipline"
                    value={formData.discipline}
                    onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
                  >
                    <option value="Commercial Direction & 3D">Commercial Direction &amp; 3D</option>
                    <option value="Kinetic Typography & Titles">Kinetic Typography &amp; Titles</option>
                    <option value="Concert & Arena Visuals">Concert &amp; Arena Visuals</option>
                    <option value="Color Science & Editorial">Color Science &amp; Editorial</option>
                  </select>
                </div>
                <div className="brief-inquiry__field">
                  <label htmlFor="timeline">Desired Timeline</label>
                  <select
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  >
                    <option value="Within 2-3 Weeks (Rush)">Within 2-3 Weeks (Rush)</option>
                    <option value="Within 4-6 Weeks">Within 4-6 Weeks</option>
                    <option value="Q3/Q4 Planning">Q3/Q4 Planning</option>
                  </select>
                </div>
              </div>

              <div className="brief-inquiry__field">
                <label htmlFor="brief">Brief Treatment Details &amp; References</label>
                <textarea
                  id="brief"
                  rows="5"
                  required
                  placeholder="Describe the aesthetic, deliverable scope, reference links, and target release date..."
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                />
              </div>

              <button type="submit" className="brief-inquiry__submit-btn">
                <span>Submit Treatment for Review</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          )}
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
