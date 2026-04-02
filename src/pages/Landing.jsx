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
          maxWidth: 580, lineHeight: 1.6, marginBottom: 16, fontWeight: 300,
        }}>
          Breaking the paywall between Western medical research and the Oromo communities it was written about.
        </p>

        <p className="animate-fade-up-2" style={{
          fontSize: 'clamp(14px, 1.8vw, 18px)', color: R, fontWeight: 600,
          maxWidth: 580, lineHeight: 1.6, marginBottom: 40,
        }}>
          Research Translation Initiative | 38 University Partners | 2.2M+ Community Reach
        </p>

        <div className="animate-fade-up-2" style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 40, flexWrap: 'wrap' }}>
          {[
            { n: '38', l: 'University Partners' },
            { n: '2.2M+', l: 'Community Reach' },
            { n: '3', l: 'Community Partners' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: R, lineHeight: 1, marginBottom: 4, fontWeight: 700 }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div className="animate-fade-up-3" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => nav('/portal')} style={btnPrimary}>Contribute to Research</button>
          <a href="#problem" style={btnSecondary}>Learn More</a>
        </div>
      </section>

      {/* ── PUBLICATION PIPELINE ── */}
      <section style={{ ...sectionStyle, background: '#FFF8F0', borderTop: '1px solid #E8E4DF' }}>
        <div style={sectionLabel}>How It Leads to Publication</div>
        <h2 style={h2Style}>From Translation to Peer-Reviewed Research</h2>
        <p style={pStyle}>Student translations feed directly into a publication pipeline. Early contributors position themselves as named co-authors on research that reaches thousands of health workers and students across Oromia.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginTop: 48 }} className="pipeline-grid">
          {[
            {
              step: 1,
              title: 'Student Translates',
              desc: 'You translate medical research into Afaan Oromo. Word counts and timestamps are recorded.',
              icon: '✎'
            },
            {
              step: 2,
              title: 'Expert Review',
              desc: 'Bilingual clinicians and researchers verify accuracy. Dr. Ibro Mengitsu (Mattu University) oversees quality.',
              icon: '✓'
            },
            {
              step: 3,
              title: 'Synthesis & Analysis',
              desc: 'Top translations become part of a systematic review or evidence synthesis for publication.',
              icon: '🔬'
            },
            {
              step: 4,
              title: 'Manuscript & Authorship',
              desc: 'Selected contributors named as co-authors. Manuscript submitted to peer-reviewed journals.',
              icon: '📚'
            },
            {
              step: 5,
              title: 'Published & Distributed',
              desc: 'Published papers shared through Oromo Health Academy (2.2M+ viewers), OMN, and community partners.',
              icon: '▶'
            },
          ].map((p, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #FFD8A8', borderRadius: 14, padding: 24, textAlign: 'center', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(187,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ fontSize: 40, marginBottom: 12, lineHeight: 1 }}>{p.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: R, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Step {p.step}</div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>{p.title}</h4>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: 'white', border: `2px solid ${R}`, borderRadius: 14, padding: 32, textAlign: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 12 }}>Current Status</h3>
          <p style={{ fontSize: 16, color: '#555', lineHeight: 1.6, margin: '0 0 16px 0' }}>
            <strong>2 manuscripts in development</strong> drawing from student translations.
          </p>
          <p style={{ fontSize: 14, color: '#777', margin: 0, fontStyle: 'italic' }}>
            Early contributors are positioned as named co-authors. Publications expected Q2-Q3 2026.
          </p>
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
        <h2 style={h2Style}>What your participation means for your CV</h2>
        <p style={pStyle}>Medical and graduate school admissions committees verify claimed experience carefully. Here's exactly what you can document through OHKB participation.</p>

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
              title: 'Co-Authorship Track',
              hours: 'Named author on peer-reviewed publication',
              what: 'Contribute to analysis and manuscript writing?',
              credit: 'Co-authorship on published paper.',
              qualify: 'Complete full publication pipeline + meet ICMJE criteria',
              tip: 'Early contributors positioned as authors. Publications Q2-Q3 2026.',
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
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#111' }}>📚 The Clinical Research Pathway</h3>
          <p style={{ fontSize: 14, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>Authorship is earned through completing our 3-stage research pipeline. You must complete the full workflow for your chosen topic—authorship is awarded only after project completion.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { n: 1, t: 'Stage 1: Translation Pipeline', sub: 'Required First', d: 'Translate & verify 5,000+ words (5–7 papers) on your chosen health topic. This builds the Global Research Registry and proves your mastery of medical terminology.' },
              { n: 2, t: 'Stage 2: Evidence Synthesis', sub: 'After Translation Quota', d: 'Analyze your translated papers. Identify clinical gaps, regional disparities, and implementation barriers. Create a research brief summarizing findings for the Oromo community.' },
              { n: 3, t: 'Stage 3: Manuscript & Journal', sub: 'Upon Project Completion', d: 'Top syntheses are selected for formal manuscript writing and peer-reviewed publication. Collaborate with the Research Lead. Earn co-authorship credit on the published paper.' },
            ].map(s => (
              <div key={s.n} style={{ background: 'white', borderRadius: 8, padding: 16, textAlign: 'center', border: '1px solid #FFD8A8' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#BB0000', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.sub}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{s.t}</div>
                <div style={{ fontSize: 12, color: '#666', lineHeight: 1.5 }}>{s.d}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: '#888', marginTop: 16, marginBottom: 0, fontStyle: 'italic' }}>Authorship is selective. Only contributors who complete the full project cycle are eligible for co-authorship on published research.</p>
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

      {/* ── COMMUNITY & MEDIA PARTNERS ── */}
      <section style={{ ...sectionStyle, borderTop: '1px solid #E8E4DF', background: '#FFF8F0' }}>
        <div style={sectionLabel}>Community Partners</div>
        <h2 style={h2Style}>Amplifying health knowledge through trusted voices</h2>
        <p style={pStyle}>OHKB works with established Oromo health educators and media organizations who reach millions. Together we translate, verify, and distribute health knowledge directly to communities who need it most.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }} className="community-partners-grid">
          {[
            {
              icon: '▶️',
              name: 'Oromo Health Academy',
              desc: 'Leading health education channel reaching 2.2M+ viewers',
              impact: 'Millions learned through verified health content',
              link: 'https://www.youtube.com/channel/UCgrgrS04v-RbLSmfCJ5AhDQ'
            },
            {
              icon: '📡',
              name: 'OMN (Oromo Media Network)',
              desc: 'Pan-African media platform serving Oromo diaspora',
              impact: 'Nationwide broadcast reach and distribution',
              link: '#'
            },
            {
              icon: '🤝',
              name: 'Odaa of United States',
              desc: 'Community leadership organization across US chapters',
              impact: 'Trusted grassroots delivery to local communities',
              link: '#'
            },
          ].map(p => (
            <a key={p.name} href={p.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ background: 'white', border: '1px solid #FFD8A8', borderRadius: 12, padding: 24, height: '100%', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = R; e.currentTarget.style.boxShadow = '0 4px 12px rgba(187,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#FFD8A8'; e.currentTarget.style.boxShadow = 'none' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: '#111' }}>{p.name}</h4>
                <p style={{ fontSize: 13, color: '#555', marginBottom: 12, lineHeight: 1.5 }}>{p.desc}</p>
                <div style={{ fontSize: 12, fontWeight: 600, color: R }}>{p.impact}</div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── UNIVERSITY PARTNERS ── */}
      <section style={sectionStyle}>
        <div style={sectionLabel}>Our Partners</div>
        <h2 style={h2Style}>University Partners Across North America & Oromia</h2>
        <p style={pStyle}>OHKB is built in partnership with student associations and universities across the Oromo diaspora in North America, and leading institutions in Oromia.</p>

        <div style={{ marginTop: 48, marginBottom: 40 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 20 }}>North American Universities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }} className="university-grid">
            {[
              'University of Minnesota (Twin Cities)',
              'The Ohio State University',
              'Augsburg University',
              'University of Minnesota Duluth',
              'Michigan State University',
              'South Dakota State University',
              'University of Texas at Austin',
              'Emory University',
              'Georgia State University',
              'University of North Texas',
              'University of Washington',
              'Seattle University',
              'Portland State University',
              'University of Colorado Boulder',
              'Harvard University',
              'Columbia University',
              'University of Alberta',
              'York University',
              'Carleton University',
              'University of Manitoba',
              'MacEwan University',
            ].map(u => (
              <div key={u} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#555', lineHeight: 1.4 }}>
                {u}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 40 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 20 }}>Oromia Universities</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }} className="university-grid">
            {[
              'Addis Ababa University',
              'Jimma University',
              'Haramaya University',
              'Adama Science and Technology University',
              'Ambo University',
              'Wollega University',
              'Madda Walabu University',
              'Bule Hora University',
              'Arsi University',
              'Metu University',
              'Oda Bultum University',
              'Salale University',
              'Borena University',
              'Dembi Dollo University',
              'Rift Valley University',
              'New Generation University College',
              'Ethiopia Adventist College',
            ].map(u => (
              <div key={u} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#555', lineHeight: 1.4 }}>
                {u}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: '#FFF5E8', border: '1px solid #FFE0CC', borderRadius: 12, padding: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>
            <strong>Dr. Ibro Mengitsu</strong> (Mattu University, Clinical Advisor) — Oversees publication process and research quality. All publications reviewed and approved by Ethiopian clinical leadership.
          </p>
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
          .community-partners-grid { grid-template-columns: 1fr !important; }
          .university-grid   { grid-template-columns: 1fr !important; }
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
