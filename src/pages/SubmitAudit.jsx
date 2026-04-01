import { useState, useContext, useEffect } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { PortalCtx } from './Portal'
import { useNavigate } from 'react-router-dom'

const R = '#BB0000'

export default function SubmitAudit() {
  const { user, db, pending, setPending } = useContext(PortalCtx)
  const nav = useNavigate()

  const [title, setTitle]       = useState('')
  const [sourceLink, setLink]   = useState('')
  const [author, setAuthor]     = useState(pending?.translatorName || '')
  const [submitting, setSub]    = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (pending?.translatorName) setAuthor(pending.translatorName)
  }, [pending])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) { setError('Please enter a title for this contribution.'); return }
    if (!pending) { setError('No translation data found. Please translate a document first.'); return }

    setSub(true)
    setError('')

    const wordCount = pending.researchMetadata?.match(/Word Count:\s*(\d+)/)?.[1]
      ? parseInt(pending.researchMetadata.match(/Word Count:\s*(\d+)/)[1])
      : 0

    const category = pending.researchMetadata?.match(/Category:\s*(.+)/)?.[1]?.trim()
      || pending.category || 'Research'

    try {
      await addDoc(collection(db, 'translations'), {
        userId:               user?.uid || 'anonymous',
        timestamp:            serverTimestamp(),
        title:                title.trim(),
        sourceLink:           sourceLink.trim(),
        author:               author.trim() || 'Anonymous',
        direction:            pending.direction,
        sourceType:           pending.sourceType,
        wordCount,
        estimatedHours:       parseFloat((wordCount / 1000).toFixed(2)),
        category,
        fullTranslation:      pending.fullTranslation,
        terminologyNotes:     pending.terminologyNotes,
        reviewerVerification: pending.reviewerVerification,
        researchMetadata:     pending.researchMetadata,
      })
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
      <div style={{ padding: '80px 48px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 16 }}>Contribution Logged</h1>
        <p style={{ color: '#555', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
          Your verified research contribution has been added to the Global Research Registry. Your contribution hours have been recorded to your dashboard.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => nav('/portal/registry')}
            style={{ background: R, color: 'white', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
            View Registry
          </button>
          <button onClick={() => nav('/portal/dashboard')}
            style={{ background: 'white', color: '#111', border: '1px solid #E8E4DF', borderRadius: 8, padding: '12px 28px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
            Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 800, margin: '0 auto' }} className="submit-pad">

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Research Submission</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Submit Verified Research Contribution</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Log this translation to the Global Research Registry and your contribution dashboard.</p>
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
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, color: '#111' }}>Contribution Details</h2>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Document Title <span style={{ color: R }}>*</span></label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Maternal Mortality in Oromia: A Systematic Review"
              style={inputStyle} required />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Source Link / DOI (optional)</label>
            <input value={sourceLink} onChange={e => setLink(e.target.value)}
              placeholder="https://pubmed.ncbi.nlm.nih.gov/..."
              style={inputStyle} />
          </div>

          <div style={{ marginBottom: 4 }}>
            <label style={labelStyle}>Researcher / Translator Name</label>
            <input value={author} onChange={e => setAuthor(e.target.value)}
              placeholder="Your full name"
              style={inputStyle} />
          </div>
        </div>

        {/* Translation preview */}
        {pending && (
          <div style={{ background: '#F8F8F6', border: '1px solid #E8E4DF', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: '#555' }}>Translation Package (auto-filled)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="preview-grid">
              <InfoRow label="Direction" value={pending.direction === 'en_or' ? 'English → Afaan Oromo' : 'Afaan Oromo → English'} />
              <InfoRow label="Document Type" value={pending.sourceType} />
            </div>
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'white', borderRadius: 8, border: '1px solid #E8E4DF' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 6 }}>Translation Preview</div>
              <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden' }}>
                {pending.fullTranslation?.slice(0, 300) || 'No translation'}…
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: '#999' }}>
              Full translation, terminology notes, reviewer verification, and research metadata will all be saved.
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
          {submitting ? 'Submitting…' : '✦ Submit to Global Research Registry'}
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
