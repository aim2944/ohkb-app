import { useState, useContext, useEffect } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { PortalCtx } from './Portal'
import { useNavigate } from 'react-router-dom'

const R = '#BB0000'

const STEPS = [
  {
    num: '1',
    done: true,
    title: 'Translate the Full Document',
    desc: 'Use the Translation Engine to translate the complete research paper or clinical document (minimum 5 pages). Do not summarize — full text only.',
  },
  {
    num: '2',
    done: true,
    title: 'Complete Contribution Details',
    desc: 'Fill in the document title, source link or DOI, your name, and your university below. All fields are required.',
  },
  {
    num: '3',
    done: false,
    title: 'Export Your Full Contribution as PDF',
    desc: 'Copy the full translation, terminology notes, and reviewer verification into a PDF document. Include your name, university, and source link.',
  },
  {
    num: '4',
    done: false,
    title: 'Email PDF to aimonibssa@gmail.com',
    desc: 'You MUST email your PDF to aimonibssa@gmail.com. This is required for your submission to be reviewed and approved for publication. Without this email your contribution will not be processed.',
    required: true,
  },
  {
    num: '5',
    done: false,
    title: 'Approval by Dr. Ibro Mengitsu',
    desc: 'Your submission will be reviewed by Dr. Ibro Mengitsu (Mattu University), the clinical advisor for all OHKB publications. You will be contacted upon approval.',
  },
  {
    num: '6',
    done: false,
    title: 'Co-Authorship & Publication (April 20, 2026)',
    desc: 'Approved contributions will be published and presented across all partner universities. U.S. students must submit by April 20, 2026 midnight to qualify for co-authorship.',
  },
]

export default function SubmitAudit() {
  const { user, db, pending, setPending } = useContext(PortalCtx)
  const nav = useNavigate()

  const [title, setTitle]       = useState('')
  const [sourceLink, setLink]   = useState('')
  const [author, setAuthor]     = useState(pending?.translatorName || '')
  const [submitting, setSub]    = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')
  const [savedUniversity, setSavedUniversity] = useState('')
  const [savedContribType, setSavedContribType] = useState('')

  useEffect(() => {
    if (pending?.translatorName) setAuthor(pending.translatorName)
  }, [pending])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Please enter a title for this contribution.'); return }
    if (!sourceLink.trim()) { setError('Please provide a source link or DOI.'); return }
    if (!author.trim()) { setError('Please enter the researcher/translator name.'); return }
    if (!pending?.university || pending.university === '— Select Your University —') { setError('Please select your university on the Translation page.'); return }
    if (!pending) { setError('No translation data found. Please translate a document first.'); return }

    setSub(true)
    setError('')

    const wordCount = pending.researchMetadata?.match(/Word Count:\s*(\d+)/)?.[1]
      ? parseInt(pending.researchMetadata.match(/Word Count:\s*(\d+)/)[1])
      : 0

    const category = pending.researchMetadata?.match(/Category:\s*(.+)/)?.[1]?.trim()
      || pending.category || 'Research'

    try {
      const submissionData = {
        userId:               user?.uid || 'anonymous',
        timestamp:            serverTimestamp(),
        title:                title.trim(),
        sourceLink:           sourceLink.trim(),
        author:               author.trim() || 'Anonymous',
        direction:            pending.direction,
        sourceType:           pending.sourceType,
        contributionType:     pending.contributionType || 'community',
        university:           pending.university || 'Not specified',
        wordCount,
        estimatedHours:       parseFloat((wordCount / 1000).toFixed(2)),
        category,
        fullTranslation:      pending.fullTranslation,
        terminologyNotes:     pending.terminologyNotes,
        reviewerVerification: pending.reviewerVerification,
        researchMetadata:     pending.researchMetadata,
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
      setSavedContribType(pending.contributionType || '')
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
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 12 }}>Form Submitted</h1>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.6 }}>
            Your contribution details are saved. Complete the remaining steps below to finalize your publication submission.
          </p>
        </div>

        {/* Remaining steps */}
        <div style={{ marginBottom: 32 }}>
          {[
            {
              num: '3',
              title: 'Export as PDF',
              desc: 'Go back to your translation results and copy the full text into a PDF. Include: full translation, terminology notes, your name, university, and source link.',
              urgent: false,
            },
            {
              num: '4',
              title: 'Email PDF to aimonibssa@gmail.com',
              desc: null,
              urgent: true,
            },
            {
              num: '5',
              title: 'Await Approval — Dr. Ibro Mengitsu (Mattu University)',
              desc: 'Your PDF will be reviewed by the clinical advisor. You will be contacted once approved for publication.',
              urgent: false,
            },
            {
              num: '6',
              title: 'Co-Authorship Listed at Publication (April 20, 2026)',
              desc: 'U.S. students must have their PDF submitted before April 20, 2026 midnight to be listed as co-author.',
              urgent: false,
            },
          ].map(s => (
            <div key={s.num} style={{
              display: 'flex', gap: 16, padding: '18px 20px', marginBottom: 12,
              background: s.urgent ? '#FFF0E8' : 'white',
              border: `1px solid ${s.urgent ? '#FFBBA8' : '#E8E4DF'}`,
              borderRadius: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: s.urgent ? R : '#F0F0ED',
                color: s.urgent ? 'white' : '#555',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14,
              }}>{s.num}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: s.desc ? 6 : 0, color: s.urgent ? R : '#111' }}>{s.title}</div>
                {s.urgent && (
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: '#333' }}>
                    Send your full contribution PDF to{' '}
                    <strong style={{ color: R }}>aimonibssa@gmail.com</strong>
                    {' '}with subject line:{' '}
                    <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: 4, fontSize: 12 }}>[OHKB] {title}</code>
                    <br />
                    <span style={{ fontSize: 12, color: '#888', marginTop: 4, display: 'block' }}>
                      ⚠ This email is REQUIRED. Without it your contribution will not be reviewed or published.
                    </span>
                  </div>
                )}
                {s.desc && <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{s.desc}</div>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 20, marginBottom: 32, fontSize: 13, color: '#555', lineHeight: 1.7 }}>
          <strong style={{ display: 'block', marginBottom: 8, color: '#111' }}>📎 What to include in your PDF:</strong>
          ✓ Full translated document text<br />
          ✓ Terminology / translation notes<br />
          ✓ Reviewer verification notes<br />
          ✓ Your full name and university<br />
          ✓ Source document title and link / DOI
        </div>

        <button onClick={() => nav('/portal/translate')}
          style={{ width: '100%', background: R, color: 'white', border: 'none', borderRadius: 10, padding: '14px', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
          ← Start Another Translation
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 800, margin: '0 auto' }} className="submit-pad">

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Research Submission</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Submit Your Contribution</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Follow all steps below to have your work reviewed and published through the OHKB network.</p>
      </div>

      {/* Publication Steps */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 16 }}>Publication Steps</div>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{
            display: 'flex', gap: 16, padding: '16px 20px', marginBottom: 10,
            background: s.required ? '#FFF0E8' : s.done ? '#F6FFF6' : 'white',
            border: `1px solid ${s.required ? '#FFBBA8' : s.done ? '#B8E8B8' : '#E8E4DF'}`,
            borderRadius: 12,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0, marginTop: 2,
              background: s.done ? '#22AA55' : s.required ? R : '#E8E4DF',
              color: s.done || s.required ? 'white' : '#888',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 13,
            }}>
              {s.done ? '✓' : s.num}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: s.required ? R : '#111' }}>
                {s.title}{s.required && <span style={{ marginLeft: 8, fontSize: 11, background: R, color: 'white', padding: '2px 8px', borderRadius: 100 }}>REQUIRED</span>}
              </div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          </div>
        ))}
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
        <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111' }}>Step 2 — Contribution Details</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Document Title <span style={{ color: R }}>*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Maternal Mortality in Oromia: A Systematic Review"
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Source Link / DOI <span style={{ color: R }}>*</span></label>
            <input value={sourceLink} onChange={e => setLink(e.target.value)}
              placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Researcher / Translator Name <span style={{ color: R }}>*</span></label>
            <input value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Your full name"
              style={inputStyle} />
          </div>
        </div>

        {pending && (
          <div style={{ background: '#F8F8F6', border: '1px solid #E8E4DF', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#555' }}>Translation Package (auto-filled)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="preview-grid">
              <InfoRow label="Direction" value={pending.direction === 'en_or' ? 'English → Afaan Oromo' : 'Afaan Oromo → English'} />
              <InfoRow label="Document Type" value={pending.sourceType} />
              <InfoRow label="University" value={pending.university} />
              <InfoRow label="Contribution Type" value={pending.contributionType} />
            </div>
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'white', borderRadius: 8, border: '1px solid #E8E4DF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 6 }}>Translation Preview</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden' }}>
                {pending.fullTranslation?.slice(0, 300) || 'No translation'}…
              </div>
            </div>
          </div>
        )}

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
          {submitting ? 'Processing…' : '✦ Complete Step 2 — Save Contribution Details'}
        </button>
      </form>

      <style>{`
        @media (max-width: 768px) {
          .submit-pad   { padding: 24px 20px !important; }
          .preview-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, color: '#111' }}>{value}</div>
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 8 }
const inputStyle = { width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '10px 14px', fontSize: 15, fontFamily: "'Outfit', sans-serif", outline: 'none', color: '#111' }
