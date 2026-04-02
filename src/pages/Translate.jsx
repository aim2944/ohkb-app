import { useState, useContext } from 'react'
import { PortalCtx } from './Portal'
import { translateDocument } from '../lib/translate'
import { useNavigate } from 'react-router-dom'

const R = '#BB0000'

const SOURCE_TYPES = [
  'Research Paper',
  'Study Abstract',
  'Clinical Note',
  'Discharge Instructions',
  'Patient Education Material',
  'Public Health Guideline',
  'General Medical Document',
]

const CONTRIBUTION_TYPES = [
  { value: 'community', label: '🤝 Community Service', desc: 'Sourcing, translating, and distributing research' },
  { value: 'research', label: '🔬 Research', desc: 'Analysis, systematic review, or data synthesis' },
  { value: 'publication', label: '📚 Publication Track', desc: 'Systematic analysis + co-authored paper (ICMJE criteria)' },
]

export default function Translate() {
  const { setPending } = useContext(PortalCtx)
  const nav = useNavigate()

  const [text, setText]           = useState('')
  const [direction, setDirection] = useState('en_or')
  const [sourceType, setSourceType] = useState('Research Paper')
  const [contributionType, setContributionType] = useState('community')
  const [translatorName, setName] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [result, setResult]       = useState(null)

  async function handleTranslate() {
    setError('')
    setResult(null)
    setLoading(true)
    try {
      const data = await translateDocument({ text, direction, sourceType, translatorName: translatorName.trim() || 'Anonymous' })
      setResult(data)
    } catch (e) {
      setError(e.message || 'Translation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit() {
    if (!result) return
    setPending({ ...result, direction, sourceType, translatorName: translatorName.trim() || 'Anonymous', contributionType })
    nav('/portal/submit')
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }} className="translate-pad">

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Translation Engine</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Afaan Oromo Medical Translator</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Full document translation for research papers, clinical documents, and health education materials.</p>
      </div>

      {/* Input panel */}
      <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }} className="input-row">
          {/* Direction */}
          <div>
            <label style={labelStyle}>Translation Direction</label>
            <select value={direction} onChange={e => setDirection(e.target.value)} style={selectStyle}>
              <option value="en_or">English → Afaan Oromo</option>
              <option value="or_en">Afaan Oromo → English</option>
            </select>
          </div>

          {/* Source type */}
          <div>
            <label style={labelStyle}>Document Type</label>
            <select value={sourceType} onChange={e => setSourceType(e.target.value)} style={selectStyle}>
              {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Translator name */}
          <div>
            <label style={labelStyle}>Your Name (for attribution)</label>
            <input value={translatorName} onChange={e => setName(e.target.value)}
              placeholder="e.g. Aimon Ibssa"
              style={{ ...selectStyle, outline: 'none' }} />
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>How Are You Contributing? *</label>
          <select value={contributionType} onChange={e => setContributionType(e.target.value)} style={selectStyle}>
            {CONTRIBUTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>)}
          </select>
          <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>
            {contributionType === 'community' && '✓ Perfect for volunteer work. Log on med school apps as "Community Service"'}
            {contributionType === 'research' && '✓ Only if you\'re analyzing/synthesizing multiple papers. Must document methodology'}
            {contributionType === 'publication' && '✓ Plan to co-author? Must: (1) perform substantive analysis, (2) write/revise manuscript, (3) meet ICMJE criteria'}
          </p>
        </div>

        <label style={labelStyle}>Paste Full Document Text</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste the full text of the medical document, research paper, or clinical note here. Do not summarize — paste the complete text for full translation."
          rows={12}
          style={{
            width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '14px 16px',
            fontSize: 15, lineHeight: 1.6, resize: 'vertical', fontFamily: "'Outfit', sans-serif",
            outline: 'none', background: '#FAFAFA', color: '#111',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
          <span style={{ fontSize: 13, color: '#999' }}>
            {text.trim() ? `${text.trim().split(/\s+/).length} words · est. ${(text.trim().split(/\s+/).length / 1000).toFixed(2)} contribution hours` : 'Paste document text above'}
          </span>
          <button
            onClick={handleTranslate}
            disabled={!text.trim() || loading}
            style={{
              background: !text.trim() || loading ? '#ddd' : R,
              color: !text.trim() || loading ? '#999' : 'white',
              border: 'none', borderRadius: 8, padding: '12px 28px',
              fontWeight: 700, fontSize: 15, cursor: !text.trim() || loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif", transition: 'background 0.2s',
            }}>
            {loading ? 'Translating…' : '⟺ Translate Document'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FFE8E8', border: '1px solid #FFBBBB', borderRadius: 10, padding: '16px 20px', marginBottom: 24, color: '#8B0000', fontSize: 14 }}>
          ⚠ {error}
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, textAlign: 'center', color: '#555' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⟺</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Translating document…</div>
          <p style={{ fontSize: 14, color: '#999', margin: 0 }}>Claude is performing a full medical translation with terminology analysis. This may take 20–60 seconds for longer documents.</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24 }}>Translation Complete</h2>
            <button onClick={handleSubmit}
              style={{ background: R, color: 'white', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              ✦ Submit Verified Research Contribution
            </button>
          </div>

          <ResultCard icon="⟺" title="Full Translation" content={result.fullTranslation} accent />
          <ResultCard icon="📋" title="Terminology / Translation Notes" content={result.terminologyNotes} />
          <ResultCard icon="🔍" title="Reviewer Verification Notes" content={result.reviewerVerification} />
          <ResultCard icon="◈" title="Research / Contribution Metadata" content={result.researchMetadata} highlight />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .translate-pad { padding: 24px 20px !important; }
          .input-row     { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function ResultCard({ icon, title, content, accent, highlight }) {
  const bg = highlight ? '#FFF8F0' : accent ? '#FFF8F8' : 'white'
  const border = highlight ? '#FFD8A8' : accent ? '#FFCCCC' : '#E8E4DF'
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, margin: 0 }}>{title}</h3>
      </div>
      <pre style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap', margin: 0 }}>
        {content || 'No content returned.'}
      </pre>
    </div>
  )
}

const labelStyle  = { display: 'block', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#555', marginBottom: 8 }
const selectStyle = { width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '10px 12px', fontSize: 14, fontFamily: "'Outfit', sans-serif", background: 'white', color: '#111', cursor: 'pointer' }
