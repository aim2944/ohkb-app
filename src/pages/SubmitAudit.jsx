import { useState, useContext, useEffect } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
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
  const { user, db, pending, setPending } = useContext(PortalCtx)
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
  const [submitting, setSub]              = useState(false)
  const [success, setSuccess]             = useState(false)
  const [error, setError]                 = useState('')
  const [savedUniversity, setSavedUniversity] = useState('')

  useEffect(() => {
    if (pending?.translatorName) setAuthor(pending.translatorName)
  }, [pending])

  async function handleSubmit(e) {
    e.preventDefault()
    // Validate all required fields
    if (!sourceTitle.trim()) { setError('Please enter the source paper title.'); return }
    if (!sourceLink.trim()) { setError('Please provide a source link or DOI.'); return }
    if (!author.trim()) { setError('Please enter the researcher/translator name.'); return }
    if (!pending?.university || pending.university === '— Select Your University —') { setError('Please select your university on the Translation page.'); return }
    if (!abstractEng.trim()) { setError('Please provide the English abstract.'); return }
    if (!abstractOrom.trim()) { setError('Please provide the Afaan Oromo Guduunfaa (Key Takeaway).'); return }
    if (!glossary.trim()) { setError('Please provide the medical glossary.'); return }
    if (!implNote.trim()) { setError('Please provide the implementation note for Oromia.'); return }
    if (!focusArea.trim()) { setError('Please select a focus area.'); return }
    if (!geoRelevance.trim()) { setError('Please specify geographic relevance.'); return }
    if (!evidenceLevel.trim()) { setError('Please select the evidence level.'); return }
    if (!icmjeVerif.trim()) { setError('Please provide the ICMJE verification statement.'); return }
    if (!pending) { setError('No translation data found. Please translate a document first.'); return }

    setSub(true)
    setError('')

    const wordCount = pending.researchMetadata?.match(/Word Count:\s*(\d+)/)?.[1]
      ? parseInt(pending.researchMetadata.match(/Word Count:\s*(\d+)/)[1])
      : 0

    try {
      const submissionData = {
        userId:               user?.uid || 'anonymous',
        timestamp:            serverTimestamp(),
        sourceTitle:          sourceTitle.trim(),
        sourceLink:           sourceLink.trim(),
        author:               author.trim() || 'Anonymous',
        direction:            pending.direction,
        sourceType:           pending.sourceType,
        university:           pending.university || 'Not specified',
        wordCount,
        fullTranslation:      pending.fullTranslation,
        terminologyNotes:     pending.terminologyNotes,
        reviewerVerification: pending.reviewerVerification,
        researchMetadata:     pending.researchMetadata,

        // Metadata Package
        metadataPackage: {
          bilingualAbstract: { english: abstractEng.trim(), oromo: abstractOrom.trim() },
          medicalGlossary:   glossary.trim(),
          implementationNote: implNote.trim(),
          registryMetadata:  { focusArea: focusArea.trim(), geoRelevance: geoRelevance.trim(), evidenceLevel: evidenceLevel.trim() },
          icmjeVerification: icmjeVerif.trim(),
        }
      }

      await addDoc(collection(db, 'translations'), submissionData)

      try {
        await fetch('/api/send-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...submissionData, timestamp: new Date().toISOString() })
        })
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr)
      }

      setSavedUniversity(pending.university || '')
      setSuccess(true)
      setPending(null)
    } catch (err) {
      setError('Failed to save contribution: ' + (err.message || 'Unknown error'))
    } finally {
      setSub(false)
    }
  }

  if (success) {
    return (
      <div style={{ padding: '60px 48px', maxWidth: 720, margin: '0 auto' }} className="submit-pad">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 12 }}>Clinical Evidence Synthesis Submitted</h1>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.6 }}>
            Your complete metadata package is saved. Complete the final step to finalize your publication submission.
          </p>
        </div>

        <div style={{ background: '#FFF0E8', border: '1px solid #FFBBA8', borderRadius: 14, padding: 28, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#111' }}>📧 Email Your Complete Submission</h2>
          <p style={{ fontSize: 14, color: '#333', marginBottom: 20, lineHeight: 1.6 }}>
            Send your full contribution package (translation + all 5 metadata components) as a <strong>PDF</strong> to <strong style={{ color: R }}>aimonibssa@gmail.com</strong>
          </p>

          <div style={{ background: 'white', borderRadius: 8, padding: 16, fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.8, color: '#555', marginBottom: 20, border: '1px solid #FFD8B8' }}>
            <strong style={{ color: '#111' }}>Email Subject:</strong><br />
            <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4 }}>[OHKB Clinical Evidence] {sourceTitle}</code>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0F0F0' }}>
              <strong style={{ color: '#111' }}>Email Body:</strong><br />
              Dear Dr. Ibro,<br />
              <br />
              Please find attached my complete clinical evidence synthesis for the research registry.<br />
              <br />
              • Title: {sourceTitle}<br />
              • University: {savedUniversity}<br />
              • Source: {sourceLink}<br />
              • Word Count: {pending?.researchMetadata?.match(/Word Count:\s*(\d+)/)?.[1] || 'N/A'}<br />
              <br />
              Thank you for reviewing my submission.
            </div>
          </div>

          <div style={{ background: '#F0F0ED', borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.6 }}>
              <strong>Your PDF must include ALL 5 components:</strong><br />
              1. Bilingual Abstract (English + Afaan Oromo)<br />
              2. Medical Glossary (English | Oromo | Context)<br />
              3. Implementation Note (for Oromia)<br />
              4. Registry Metadata (Focus Area, Geographic Relevance, Evidence Level)<br />
              5. ICMJE Verification Statement
            </p>
          </div>
        </div>

        <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 20, marginBottom: 32, fontSize: 13, color: '#555', lineHeight: 1.7 }}>
          <strong style={{ display: 'block', marginBottom: 8, color: '#111' }}>⏱ Timeline:</strong>
          ✓ Submission closes: <strong>April 20, 2026 midnight</strong><br />
          ✓ U.S. students must submit by this date to qualify for co-authorship<br />
          ✓ Publication: Week of April 20 across all partner universities
        </div>

        <button onClick={() => nav('/portal/translate')}
          style={{ width: '100%', background: R, color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
          ← Start Another Translation
        </button>
      </div>
    )
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

      <form onSubmit={handleSubmit}>

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

        <button type="submit" disabled={submitting || !pending}
          style={{
            width: '100%', background: submitting || !pending ? '#ddd' : R, color: submitting || !pending ? '#999' : 'white',
            border: 'none', borderRadius: 10, padding: '16px', fontWeight: 700, fontSize: 16,
            cursor: submitting || !pending ? 'not-allowed' : 'pointer', fontFamily: "'Outfit', sans-serif",
          }}>
          {submitting ? 'Processing…' : '✦ Complete All 5 Components — Save Metadata Package'}
        </button>
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
