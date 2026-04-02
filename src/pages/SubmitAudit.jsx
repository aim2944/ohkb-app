import { useState, useContext, useEffect } from 'react'
import { PortalCtx } from './Portal'
import { useNavigate } from 'react-router-dom'

const R = '#BB0000'

const METADATA_COMPONENTS = [
  {
    num: '1',
    title: 'Bilingual Abstract (200 words max)',
    desc: 'Provide a technical abstract in English AND a simplified "Key Takeaway" (Guduunfaa) in Afaan Oromo for local health workers.',
    required: true,
  },
  {
    num: '2',
    title: 'Medical Glossary',
    desc: 'Document all medical terminology decisions. Format: English Term | Afaan Oromo Translation | Clinical Context. This proves linguistic validation.',
    required: true,
  },
  {
    num: '3',
    title: 'Implementation Note',
    desc: 'How does this Western research apply to Oromia? (e.g., rural access, climate, local resources). This transforms translation into research.',
    required: true,
  },
  {
    num: '4',
    title: 'Registry Metadata',
    desc: 'Categorize your contribution: Focus Area, Geographic Relevance, Evidence Level (Systematic Review / RCT / Case Study, etc.)',
    required: true,
  },
  {
    num: '5',
    title: 'ICMJE Verification',
    desc: 'Signed statement: "I verify this translation was cross-referenced with [specific medical source] and synthesized for clinical accuracy." Include word count.',
    required: true,
  },
]

export default function SubmitAudit() {
  const { pending } = useContext(PortalCtx)
  const nav = useNavigate()

  const [sourceTitle, setSourceTitle]     = useState('')
  const [sourceLink, setSourceLink]       = useState('')
  const [author, setAuthor]               = useState(pending?.translatorName || '')
  const [abstractEng, setAbstractEng]     = useState('')
  const [abstractOrom, setAbstractOrom]   = useState('')
  const [glossary, setGlossary]           = useState('')
  const [implNote, setImplNote]           = useState('')
  const [focusArea, setFocusArea]         = useState('')
  const [geoRelevance, setGeoRelevance]   = useState('')
  const [evidenceLevel, setEvidenceLevel] = useState('')
  const [icmjeVerif, setIcmjeVerif]       = useState('')
  const [error, setError]                 = useState('')

  useEffect(() => {
    if (pending?.translatorName) setAuthor(pending.translatorName)
  }, [pending])

  function handleEmail(e) {
    e.preventDefault()
    if (!sourceTitle.trim()) { setError('Please enter the source paper title.'); return }
    if (!author.trim()) { setError('Please enter your name.'); return }
    setError('')

    const wordCount = pending?.researchMetadata?.match(/Word Count:\s*(\d+)/)?.[1] || 'N/A'
    const university = pending?.university || 'Not specified'

    const subject = `[OHKB Clinical Evidence] ${sourceTitle.trim()}`

    const body = `Dear Dr. Ibro,

Please find attached my complete clinical evidence synthesis for the OHKB research registry.

SUBMISSION DETAILS
==================
Title: ${sourceTitle.trim()}
Researcher / Translator: ${author.trim()}
University: ${university}
Source / DOI: ${sourceLink.trim() || 'N/A'}
Word Count: ${wordCount}

------------------------------------------------------------
COMPONENT 1 — BILINGUAL ABSTRACT (ENGLISH)
------------------------------------------------------------
${abstractEng.trim() || '(not filled)'}

------------------------------------------------------------
COMPONENT 1 — AFAAN OROMO GUDUUNFAA
------------------------------------------------------------
${abstractOrom.trim() || '(not filled)'}

------------------------------------------------------------
COMPONENT 2 — MEDICAL GLOSSARY
------------------------------------------------------------
${glossary.trim() || '(not filled)'}

------------------------------------------------------------
COMPONENT 3 — IMPLEMENTATION NOTE (OROMIA)
------------------------------------------------------------
${implNote.trim() || '(not filled)'}

------------------------------------------------------------
COMPONENT 4 — REGISTRY METADATA
------------------------------------------------------------
Focus Area: ${focusArea.trim() || 'N/A'}
Geographic Relevance: ${geoRelevance.trim() || 'N/A'}
Evidence Level: ${evidenceLevel.trim() || 'N/A'}

------------------------------------------------------------
COMPONENT 5 — ICMJE VERIFICATION STATEMENT
------------------------------------------------------------
${icmjeVerif.trim() || '(not filled)'}

------------------------------------------------------------
FULL TRANSLATION (from Translation Engine)
------------------------------------------------------------
${pending?.fullTranslation?.slice(0, 3000) || '(attach PDF with full translation)'}

Thank you for reviewing my submission.

${author.trim()}`

    const mailto = `mailto:aimonibssa@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 900, margin: '0 auto' }} className="submit-pad">

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Clinical Evidence Synthesis</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Complete Your Metadata Package</h1>
        <p style={{ color: '#555', fontSize: 16 }}>A professional clinical research submission requires more than translation. Complete all 5 components below.</p>
      </div>

      {!pending && (
        <div style={{ background: '#FFE8E8', border: '1px solid #FFBBBB', borderRadius: 10, padding: '20px 24px', marginBottom: 24, color: '#8B0000' }}>
          <strong>No translation loaded.</strong> Please{' '}
          <button onClick={() => nav('/portal/translate')} style={{ color: R, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontSize: 'inherit', fontFamily: 'inherit' }}>
            translate a document first
          </button>{' '}
          then click "Submit Verified Research Contribution" from the results.
        </div>
      )}

      <form onSubmit={handleEmail}>

        {/* Source Information */}
        <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111' }}>Source Paper Information</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Paper Title <span style={{ color: R }}>*</span></label>
            <input value={sourceTitle} onChange={e => setSourceTitle(e.target.value)}
              placeholder="e.g. Maternal Mortality in Oromia: A Systematic Review"
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Source Link / DOI <span style={{ color: R }}>*</span></label>
            <input value={sourceLink} onChange={e => setSourceLink(e.target.value)}
              placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Your Name <span style={{ color: R }}>*</span></label>
            <input value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Your full name"
              style={inputStyle} />
          </div>
        </div>

        {/* 5 Metadata Components */}
        {[
          { title: 'Bilingual Abstract — English', field: abstractEng, setField: setAbstractEng, placeholder: 'Technical summary of study findings (max 200 words)...', rows: 4 },
          { title: 'Bilingual Abstract — Afaan Oromo (Guduunfaa)', field: abstractOrom, setField: setAbstractOrom, placeholder: 'Simplified key takeaway for local health workers (max 200 words)...', rows: 4 },
          { title: 'Medical Glossary', field: glossary, setField: setGlossary, placeholder: 'Format: English Term | Afaan Oromo Translation | Clinical Context\nExample: Cardiovascular Disease | Dhukkuba Onnee fi Marrummaan Dhiigaa | Heart and blood vessel condition\n\n(Continue for all medical terms in the paper)...', rows: 6 },
          { title: 'Implementation Note — How Does This Apply to Oromia?', field: implNote, setField: setImplNote, placeholder: 'How does this Western research apply to Oromia?\nExample: This $5,000 diagnostic tool is unavailable in Harar region; recommend manual screening methods from page 14...\n\n(Address: rural access, climate, local resources, affordability)', rows: 5 },
        ].map((comp, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#111' }}>Component {i + 1}</h2>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{METADATA_COMPONENTS[i].desc}</p>
            <label style={labelStyle}>{comp.title} <span style={{ color: R }}>*</span></label>
            <textarea value={comp.field} onChange={e => comp.setField(e.target.value)}
              placeholder={comp.placeholder}
              rows={comp.rows}
              style={{ ...textareaStyle }}
              required />
          </div>
        ))}

        {/* Registry Metadata */}
        <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#111' }}>Component 4</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>Categorize your contribution for the research registry</p>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Focus Area <span style={{ color: R }}>*</span></label>
            <input value={focusArea} onChange={e => setFocusArea(e.target.value)}
              placeholder="e.g. Maternal Health, Infectious Disease, Chronic Illness, Mental Health"
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Geographic Relevance <span style={{ color: R }}>*</span></label>
            <input value={geoRelevance} onChange={e => setGeoRelevance(e.target.value)}
              placeholder="e.g. Eastern Ethiopia, Rural Highland, Urban Finfinnee, Pastoral Regions"
              style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Evidence Level <span style={{ color: R }}>*</span></label>
            <input value={evidenceLevel} onChange={e => setEvidenceLevel(e.target.value)}
              placeholder="e.g. Systematic Review, Randomized Control Trial, Case Study, Guideline"
              style={inputStyle} required />
          </div>
        </div>

        {/* ICMJE Verification */}
        <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#111' }}>Component 5</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>{METADATA_COMPONENTS[4].desc}</p>
          <label style={labelStyle}>ICMJE Verification Statement <span style={{ color: R }}>*</span></label>
          <textarea value={icmjeVerif} onChange={e => setIcmjeVerif(e.target.value)}
            placeholder="Example: I verify that this translation has been cross-referenced with Stedman's Medical Dictionary and the WHO Health Topics glossary, and has been synthesized for clinical accuracy in the Oromia context. Word count: 3,450."
            rows={3}
            style={{ ...textareaStyle }}
            required />
        </div>

        {error && (
          <div style={{ background: '#FFE8E8', border: '1px solid #FFBBBB', borderRadius: 10, padding: '14px 18px', marginBottom: 20, color: '#8B0000', fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        <button type="submit"
          style={{ width: '100%', background: R, color: 'white', border: 'none', borderRadius: 10, padding: '16px', fontWeight: 700, fontSize: 16, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
          📧 Open Email to aimonibssa@gmail.com
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: '#999', marginTop: 10 }}>
          This will open your email app pre-filled with everything you wrote above. Attach your PDF and hit send.
        </p>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .submit-pad { padding: 24px 20px !important; }
        }
      `}</style>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 8 }
const inputStyle = { width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '10px 14px', fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', color: '#111' }
const textareaStyle = { width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', color: '#111', resize: 'vertical', lineHeight: 1.5 }
