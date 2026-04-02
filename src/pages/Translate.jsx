import { useState, useContext } from 'react'
import { PortalCtx } from './Portal'
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

const UNIVERSITIES = [
  '— Select Your University —',
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
]

export default function Translate() {
  const { setPending } = useContext(PortalCtx)
  const nav = useNavigate()

  const [translatorName, setName] = useState('')
  const [university, setUniversity] = useState('')
  const [sourceType, setSourceType] = useState('Research Paper')
  const [contributionType, setContributionType] = useState('community')
  const [translatedText, setTranslatedText] = useState('')

  function handleSubmit() {
    if (!translatedText.trim() || !university) {
      alert('Please provide both a translated document and select your university.')
      return
    }
    setPending({
      fullTranslation: translatedText,
      translatorName: translatorName.trim() || 'Anonymous',
      sourceType,
      contributionType,
      university
    })
    nav('/portal/submit')
  }

  return (
    <div style={{ padding: '40px 48px', maxWidth: 1200, margin: '0 auto' }} className="translate-pad">

      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Translation Engine</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Afaan Oromo Medical Translator</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Use the embedded translator below, then paste your translation and complete your contribution information.</p>
      </div>

      {/* Translator iframe */}
      <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 0, marginBottom: 24, overflow: 'hidden' }}>
        <iframe
          src="https://oromotoenglish.com/translator?sl=English&tl=Oromo"
          style={{
            width: '100%',
            height: '600px',
            border: 'none',
            borderRadius: '14px'
          }}
          title="Oromo to English Translator"
        />
      </div>

      {/* Contribution form */}
      <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 14, padding: 28, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }} className="input-row">
          {/* Translator name */}
          <div>
            <label style={labelStyle}>Your Name (for attribution)</label>
            <input value={translatorName} onChange={e => setName(e.target.value)}
              placeholder="e.g. Aimon Ibssa"
              style={{ ...selectStyle, outline: 'none' }} />
          </div>

          {/* Source type */}
          <div>
            <label style={labelStyle}>Document Type</label>
            <select value={sourceType} onChange={e => setSourceType(e.target.value)} style={selectStyle}>
              {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Your University *</label>
          <select value={university} onChange={e => setUniversity(e.target.value)} style={selectStyle}>
            {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
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

        <label style={labelStyle}>Paste Your Translation Here *</label>
        <textarea
          value={translatedText}
          onChange={e => setTranslatedText(e.target.value)}
          placeholder="Copy your translated text from the translator tool above and paste it here."
          rows={20}
          style={{
            width: '100%', border: '1px solid #E8E4DF', borderRadius: 8, padding: '14px 16px',
            fontSize: 15, lineHeight: 1.6, resize: 'vertical', fontFamily: "'Outfit', sans-serif",
            outline: 'none', background: '#FAFAFA', color: '#111', minHeight: '300px',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button
            onClick={handleSubmit}
            disabled={!translatedText.trim() || !university}
            style={{
              background: !translatedText.trim() || !university ? '#ddd' : R,
              color: !translatedText.trim() || !university ? '#999' : 'white',
              border: 'none', borderRadius: 8, padding: '12px 28px',
              fontWeight: 700, fontSize: 15, cursor: !translatedText.trim() || !university ? 'not-allowed' : 'pointer',
              fontFamily: "'Outfit', sans-serif", transition: 'background 0.2s',
            }}>
            ✦ Continue to Submission
          </button>
        </div>
      </div>

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
