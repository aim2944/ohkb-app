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
    if (!sourceLink.trim()) { setError('Please provide a source link or DOI.'); return }
    if (!author.trim()) { setError('Please enter the researcher/translator name.'); return }
    if (!pending?.university || pending.university === '— Select Your University —') { setError('Please select your university.'); return }
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

      // Send to email
      try {
        await fetch('/api/send-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: submissionData.title,
            author: submissionData.author,
            university: submissionData.university,
            wordCount: submissionData.wordCount,
            estimatedHours: submissionData.estimatedHours,
            sourceType: submissionData.sourceType,
            direction: submissionData.direction,
            contributionType: submissionData.contributionType,
            sourceLink: submissionData.sourceLink,
            fullTranslation: submissionData.fullTranslation,
            terminologyNotes: submissionData.terminologyNotes,
            reviewerVerification: submissionData.reviewerVerification,
            researchMetadata: submissionData.researchMetadata,
            timestamp: new Date().toISOString()
          })
        })
      } catch (emailErr) {
        console.error('Email notification failed:', emailErr)
        // Don't fail submission if email fails
      }

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
      <div style={{ padding: '80px 48px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
          <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 16 }}>Ready to Submit</h1>
          <p style={{ color: '#555', fontSize: 16, lineHeight: 1.6 }}>
            Your translation is complete. Now submit your full contribution to Dr. Ibro Mengitsu for publication approval.
          </p>
        </div>

        <div style={{ background: '#FFF0E8', border: '1px solid #FFBBA8', borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: '#111' }}>📧 Email Your Full Contribution</h2>
          <p style={{ fontSize: 14, color: '#333', marginBottom: 20, lineHeight: 1.6 }}>
            Send your complete contribution as a <strong>PDF</strong> to <strong style={{ color: R }}>aimonibssa@gmail.com</strong>
          </p>

          <div style={{ background: 'white', borderRadius: 8, padding: 16, fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.8, color: '#555', marginBottom: 20, border: '1px solid #FFD8B8' }}>
            <div style={{ fontWeight: 700, marginBottom: 12, color: '#111' }}>Email Template:</div>
            <div style={{ marginBottom: 12 }}>
              <strong>Subject:</strong><br />
              <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: 4 }}>[OHKB] {title}</code>
            </div>
            <div style={{ marginBottom: 12 }}>
              <strong>Body:</strong><br />
              Dear Dr. Ibro,<br />
              <br />
              Please find attached my full contribution for the research registry.<br />
              <br />
              • Title: {title}<br />
              • University: {pending?.university}<br />
              • Contribution Type: {pending?.contributionType}<br />
              • Source: {sourceLink}<br />
              <br />
              Thank you for reviewing my submission.
            </div>
            <div>
              <strong>Attachment:</strong> Full_Contribution_{author?.replace(/\s+/g, '_')}.pdf
            </div>
          </div>

          <div style={{ background: '#F0F0ED', borderRadius: 8, padding: 12, marginBottom: 0 }}>
            <p style={{ fontSize: 12, color: '#666', margin: 0, lineHeight: 1.5 }}>
              <strong>What to include in your PDF:</strong><br />
              ✓ Full translation<br />
              ✓ Terminology notes<br />
              ✓ Source document link<br />
              ✓ Your name and university
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={() => nav('/portal/translate')}
            style={{ background: R, color: 'white', border: 'none', borderRadius: 8, padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>
            ← New Translation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 800, margin: '0 auto' }} className="submit-pad">

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Research Submission</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Submit Your Contribution</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Complete the submission details below, then email your full contribution PDF to Dr. Ibro Mengitsu for approval.</p>
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


        {/* Academic Integrity Note */}
        <div style={{ background: '#FFF8DC', border: '1px solid #FFEFD5', borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14, color: '#111' }}>⚖️ Academic Integrity Note</h2>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: '#444' }}>
            <p style={{ marginBottom: 12 }}>
              <strong>Translation work does not create authorship of the original paper.</strong> You are translating existing research, not conducting your own study. When referencing this contribution in applications or your CV:
            </p>
            <ul style={{ marginLeft: 20, marginBottom: 12 }}>
              <li style={{ marginBottom: 8 }}>Do not claim you are an author of the original research.</li>
              <li style={{ marginBottom: 8 }}>Be clear about your role: "Translator" or "Translation contributor," not "Author."</li>
              <li style={{ marginBottom: 8 }}>If you performed analysis (e.g., systematic review of multiple papers), document that explicitly.</li>
              <li style={{ marginBottom: 0 }}>If you plan to co-author a publication based on these translations, discuss authorship criteria with your collaborators using standard guidelines (e.g., ICMJE).</li>
            </ul>
            <p style={{ marginBottom: 0, fontWeight: 600 }}>
              Medical school admissions committees review these claims carefully. Accurate representation strengthens your application.
            </p>
          </div>
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
          {submitting ? 'Processing…' : '✦ Complete Submission'}
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
