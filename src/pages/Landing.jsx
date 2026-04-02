import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const R = '#BB0000'

export default function Landing() {
  const nav = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif", background: '#FAF8F5', color: '#111' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(250,248,245,0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E8E4DF', padding: '0 32px',
        height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: R, textDecoration: 'none' }}>OHKB</a>

        <ul style={{ display: 'flex', gap: 32, listStyle: 'none', margin: 0, padding: 0 }}
            className="nav-desktop-links">
          <li><a href="#problem" style={navLink}>The Problem</a></li>
          <li><a href="#how" style={navLink}>How It Works</a></li>
          <li><a href="#topics" style={navLink}>Topics</a></li>
          <li>
            <button onClick={() => nav('/portal')} style={navCta}>Enter Portal</button>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
          className="nav-mobile-btn">
          <span style={bar} /><span style={bar} /><span style={bar} />
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '120px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -200, right: -200, width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(187,0,0,0.06) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#FFE8E8', color: R, padding: '8px 16px',
          borderRadius: 100, fontSize: 13, fontWeight: 600, marginBottom: 32,
        }}>
          <span className="animate-pulse-dot" style={{ width: 8, height: 8, background: R, borderRadius: '50%', display: 'inline-block' }} />
          Active Research Project
        </div>

        <h1 className="animate-fade-up-1" style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 1.05,
          maxWidth: 800, marginBottom: 24,
        }}>
          Oromo Health <span style={{ color: R }}>Knowledge Bridge</span>
        </h1>

        <p className="animate-fade-up-2" style={{
          fontSize: 'clamp(16px, 2vw, 20px)', color: '#555',
          maxWidth: 580, lineHeight: 1.6, marginBottom: 40, fontWeight: 300,
        }}>
          Breaking the paywall between Western medical research and the Oromo communities it was written about.
        </p>

        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/portal')} style={btnPrimary}>Enter the Portal</button>
          <a href="#problem" style={btnSecondary}>Learn More</a>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section id="problem" style={sectionStyle}>
        <div style={sectionLabel}>The Problem</div>
        <h2 style={h2Style}>The research exists. They can't access it.</h2>
        <p style={pStyle}>A student at an American university can open PubMed, JSTOR, or ScienceDirect and instantly access millions of medical research papers for free — paid for by institutional subscriptions.</p>
        <p style={pStyle}>A student at a university in Ethiopia cannot. A single journal article costs $30–50. Entire databases are completely unavailable. <strong style={{ color: '#111' }}>Research on maternal mortality in Oromia, waterborne disease in Harar, malnutrition in rural eastern Ethiopia — studies literally conducted in their communities, about their people — sits behind paywalls they will never be able to pay.</strong></p>
        <p style={pStyle}>And none of it has ever been translated into Afaan Oromo.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }} className="stat-grid">
          {[
            { n: '$30+', l: 'Cost per journal article from Ethiopia' },
            { n: '50M+', l: 'Afaan Oromo speakers worldwide' },
            { n: '0',    l: 'Translated health resources in Afaan Oromo' },
          ].map(s => (
            <div key={s.n} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 12, padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 42, color: R, lineHeight: 1, marginBottom: 8 }}>{s.n}</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ ...sectionStyle, borderTop: '1px solid #E8E4DF' }}>
        <div style={sectionLabel}>How It Works</div>
        <h2 style={h2Style}>We have the access. We build the pipeline.</h2>
        <p style={pStyle}>Oromo diaspora college students across the nation use their free university database access to find, translate, and deliver medical research to the people who need it most — powered by AI translation and human expert review.</p>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 48 }}>
          {[
            { n: 1, t: 'Find the Research', d: 'Search paywalled databases — PubMed, JSTOR, ScienceDirect, WHO, CDC — for published studies on health challenges affecting Oromo communities.' },
            { n: 2, t: 'Translate into Afaan Oromo', d: 'Use the OHKB Translation Engine to produce full document translations with medical terminology notes and reviewer verification packages.' },
            { n: 3, t: 'Expert Review', d: 'Bilingual researchers and health workers verify translations for clinical accuracy before they enter the Global Research Registry.' },
            { n: 4, t: 'Find the Right People', d: 'Use personal networks to identify Oromo students, professors, and health workers in Ethiopia who work on these topics and need this research.' },
            { n: 5, t: 'Deliver & Distribute', d: 'Send research packages directly to recipients in Ethiopia. Distribute Afaan Oromo content through WhatsApp, Telegram, social media, and diaspora community organizations.' },
          ].map((step, i, arr) => (
            <div key={step.n} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', paddingBottom: i < arr.length - 1 ? 36 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 44, height: 44, background: R, color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>{step.n}</div>
                {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: '#E8E4DF', marginTop: 8, minHeight: 28 }} />}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, marginTop: 10 }}>{step.t}</h3>
                <p style={{ fontSize: 15, color: '#555', lineHeight: 1.6, margin: 0 }}>{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEGITIMATE HOURS ── */}
      <section style={{ ...sectionStyle, borderTop: '1px solid #E8E4DF', background: '#FFF8F0' }}>
        <div style={sectionLabel}>Your Resume</div>
        <h2 style={h2Style}>How these hours count for applications</h2>
        <p style={pStyle}>Medical and graduate school admissions committees verify claimed experience carefully. Here's exactly how your OHKB contribution translates to documented hours for your CV.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }} className="hours-grid">
          {[
            {
              icon: '🤝',
              title: 'Community Service Hours',
              hours: '1 hour per 1,000 words translated',
              what: 'Translate a 5,000-word clinical guideline?',
              credit: '5 hours documented community service.',
              qualify: 'Sourcing, translating, and distributing research',
              tip: 'Perfect for medical school "Community Service" section',
            },
            {
              icon: '🔬',
              title: 'Research Hours',
              hours: '1 hour per 1,000 words analyzed',
              what: 'Systematic review of 10 papers totaling 50,000 words?',
              credit: '50 hours documented research.',
              qualify: 'Only if performing analysis, synthesis, or review',
              tip: 'Requires documented methodology — not just translation',
            },
            {
              icon: '📚',
              title: 'Publication Track',
              hours: 'Full authorship on journal submission',
              what: 'Co-author a systematic review or research synthesis?',
              credit: 'Named author on published paper.',
              qualify: 'Perform analysis + co-author publication + meet ICMJE criteria',
              tip: 'Must contribute to conception, analysis, and manuscript writing',
            },
          ].map((h, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #FFD8A8', borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{h.icon}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{h.title}</h4>
              <div style={{ fontSize: 13, fontWeight: 600, color: R, marginBottom: 12 }}>{h.hours}</div>

              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                <p style={{ marginBottom: 8, fontStyle: 'italic' }}><strong>{h.what}</strong></p>
                <p style={{ marginBottom: 8 }}>✓ {h.credit}</p>
                <p style={{ marginBottom: 8, color: '#777', fontSize: 12 }}>Qualifies if: {h.qualify}</p>
                <p style={{ marginBottom: 0, background: '#FFF5E8', padding: '6px 8px', borderRadius: 4, fontSize: 12 }}>💡 {h.tip}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 40, background: '#FFF5E8', border: '1px solid #FFE0CC', borderRadius: 12, padding: 28, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111' }}>📚 Steps to Qualify for Publication Track</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { n: 1, t: 'Perform Analysis', d: 'Systematically review 5+ papers on a focused topic. Document your search strategy, inclusion criteria, and findings.' },
              { n: 2, t: 'Co-Author Manuscript', d: 'Write a research brief, systematic review, or evidence synthesis. You must contribute substantially to writing, not just translating.' },
              { n: 3, t: 'Meet ICMJE Criteria', d: 'Confirm you meet journal authorship standards: conception/design, data interpretation, manuscript revision, and accountability.' },
            ].map(s => (
              <div key={s.n} style={{ background: 'white', borderRadius: 8, padding: 16, textAlign: 'center', border: '1px solid #FFD8A8' }}>
                <div style={{ fontWeight: 700, color: '#FF9500', marginBottom: 8 }}>Step {s.n}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#888', marginTop: 16, marginBottom: 0, fontStyle: 'italic' }}>Discuss authorship explicitly with collaborators before submission. Use ICMJE authorship checklist to confirm eligibility.</p>
        </div>

        <div style={{ marginTop: 0, background: '#FFF', border: '1px solid #FFD8A8', borderRadius: 12, padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: '#111' }}>Academic Integrity &amp; Honesty</h3>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7, margin: 0 }}>
            Translation work does not create authorship of the original paper. Be clear about your role when describing contributions on your CV. Admissions committees review these carefully — accuracy strengthens your application. Every contribution you submit to OHKB is logged with verified word counts, timestamps, and metadata to back up exactly what you did.
          </p>
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section id="topics" style={{ ...sectionStyle, borderTop: '1px solid #E8E4DF' }}>
        <div style={sectionLabel}>Focus Areas</div>
        <h2 style={h2Style}>Health topics that matter</h2>
        <p style={pStyle}>Each cycle, the team selects topics where published research exists but is inaccessible in Ethiopia and unavailable in Afaan Oromo. Contributors choose what interests them.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 36 }} className="topic-grid">
          {[
            { t: 'Maternal & Child Health', s: 'Leading cause of death in the region' },
            { t: 'Infectious Disease', s: 'Cholera, typhoid, TB, malaria' },
            { t: 'Nutrition & Malnutrition', s: 'Proven interventions not reaching communities' },
            { t: 'Mental Health', s: 'Heavily stigmatized, zero Afaan Oromo resources' },
            { t: 'Environmental Health', s: 'Water quality, deforestation, agriculture' },
            { t: 'Chronic Disease', s: 'Diabetes, hypertension — rising fast' },
            { t: 'Reproductive Health', s: 'Sexual and reproductive health education' },
            { t: 'Preventive Care', s: 'Vaccination, hygiene, disease prevention' },
          ].map(c => (
            <div key={c.t} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 10, padding: '20px 24px', fontSize: 15, fontWeight: 500, transition: 'border-color 0.2s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = R}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E8E4DF'}>
              {c.t}
              <span style={{ display: 'block', fontSize: 13, fontWeight: 400, color: '#999', marginTop: 4 }}>{c.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOIN / BENEFITS ── */}
      <section id="join" style={{ ...sectionStyle, borderTop: '1px solid #E8E4DF' }}>
        <div style={sectionLabel}>Get Involved</div>
        <h2 style={h2Style}>What you get out of it</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 36, marginBottom: 48 }} className="benefit-grid">
          {[
            { h: 'Research Contribution Hours', d: 'Every translation is logged with verified word counts and estimated contribution time — trackable, defensible, documentable for applications.' },
            { h: 'Research Experience', d: 'Documented community health research with tangible, measurable output in the Global Research Registry that you can point to.' },
            { h: 'Co-Authorship & Credit', d: 'All contributors are credited on any published research — real academic credit for med school, grad school, or professional applications.' },
            { h: 'Direct Impact', d: 'The work goes to real people. Oromo students, health workers, and communities who need it most.' },
          ].map(b => (
            <div key={b.h} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 10, padding: 24 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{b.h}</h4>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>{b.d}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: '#111', borderRadius: 16, padding: '64px 48px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, background: 'radial-gradient(circle, rgba(187,0,0,0.3) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
          <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, color: 'white', marginBottom: 16, position: 'relative' }}>
            Ready to contribute?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.6, position: 'relative' }}>
            Everyone contributes to all parts of the project. Use the portal to translate, submit verified contributions, and build your research portfolio.
          </p>
          <button onClick={() => nav('/portal')} style={{ ...btnPrimary, fontSize: 18, padding: '16px 40px', position: 'relative' }}>
            Enter the Portal
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid #E8E4DF', padding: '48px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, color: R, marginBottom: 8 }}>Oromo Health Knowledge Bridge</div>
        <div style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>Research Lead: Aimon Ibssa, B.S. Pre-M.D.</div>
        <div><a href="mailto:oromobuckeyes@gmail.com" style={{ fontSize: 14, color: R, textDecoration: 'none' }}>oromobuckeyes@gmail.com</a></div>
        <div style={{ fontSize: 13, color: '#999', marginTop: 24, fontStyle: 'italic' }}>We have the access. They don't. Let's fix that.</div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-mobile-btn    { display: block !important; }
          .stat-grid         { grid-template-columns: 1fr !important; }
          .hours-grid        { grid-template-columns: 1fr !important; }
          .topic-grid        { grid-template-columns: 1fr !important; }
          .benefit-grid      { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const navLink  = { fontSize: 14, fontWeight: 500, color: '#555', textDecoration: 'none' }
const navCta   = { background: '#BB0000', color: 'white', padding: '8px 20px', borderRadius: 6, fontWeight: 600, border: 'none', cursor: 'pointer', fontSize: 14 }
const bar      = { display: 'block', width: 24, height: 2, background: '#111', margin: '5px 0' }

const btnPrimary   = { background: '#BB0000', color: 'white', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }
const btnSecondary = { background: 'transparent', color: '#111', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, fontSize: 16, border: '1px solid #E8E4DF', display: 'inline-block' }

const sectionStyle = { padding: '100px 24px', maxWidth: 900, margin: '0 auto' }
const sectionLabel = { fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#BB0000', marginBottom: 16 }
const h2Style      = { fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.15, marginBottom: 24 }
const pStyle       = { fontSize: 17, lineHeight: 1.7, color: '#555', marginBottom: 16 }
