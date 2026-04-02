import { useEffect, useState, useContext } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { PortalCtx } from './Portal'

const R = '#BB0000'

export default function Registry() {
  const { db } = useContext(PortalCtx)
  const [docs, setDocs]     = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    if (!db) { setReady(true); return }
    const q = query(collection(db, 'translations'), orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setReady(true)
    }, () => setReady(true))
    return unsub
  }, [db])

  const universities = ['All', ...new Set(docs.map(d => d.university || 'Unknown').filter(u => u))]

  const filtered = docs.filter(d => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      (d.title || '').toLowerCase().includes(q) ||
      (d.author || '').toLowerCase().includes(q) ||
      (d.sourceType || '').toLowerCase().includes(q)
    const matchFilter = filter === 'All' || d.university === filter
    return matchSearch && matchFilter
  })

  const totalWords = docs.reduce((a, d) => a + (d.wordCount || 0), 0)
  const totalHours = (totalWords / 1000).toFixed(1)

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }} className="reg-pad">

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Student Contributions</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Contributions by University</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Medical research translations submitted by students across our partner institutions.</p>
      </div>

      {/* Registry stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }} className="reg-stats">
        {[
          { label: 'Total Contributions', value: docs.length },
          { label: 'Words Translated',    value: totalWords.toLocaleString() },
          { label: 'Research Hours',      value: `${totalHours} hrs` },
        ].map(s => (
          <div key={s.label} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 10, padding: '18px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 28, color: R, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, researcher, or document type…"
          style={{ flex: 1, minWidth: 200, border: '1px solid #E8E4DF', borderRadius: 8, padding: '10px 14px', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {universities.slice(0, 8).map(u => (
            <button key={u} onClick={() => setFilter(u)}
              style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                borderColor: filter === u ? R : '#E8E4DF',
                background: filter === u ? R : 'white',
                color: filter === u ? 'white' : '#555',
              }}>
              {u}
            </button>
          ))}
          {universities.length > 8 && (
            <button onClick={() => setFilter(universities[Math.floor(Math.random() * universities.length)])}
              style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid #E8E4DF', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: '#999' }}>
              +{universities.length - 8} more
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {!ready && <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>Loading registry…</div>}

      {ready && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#999' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>◉</div>
          {docs.length === 0
            ? <><div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>Registry is empty</div><p>Be the first to submit a verified research contribution.</p></>
            : <><div style={{ fontSize: 16, fontWeight: 600, color: '#555', marginBottom: 8 }}>No results found</div><p>Try a different search term or category.</p></>
          }
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map(doc => (
          <RegistryCard key={doc.id} doc={doc} />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .reg-pad   { padding: 24px 20px !important; }
          .reg-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function RegistryCard({ doc }) {
  const [expanded, setExpanded] = useState(false)

  const dirLabel = doc.direction === 'en_or' ? 'EN → OR' : 'OR → EN'
  const ts = doc.timestamp?.toDate?.()?.toLocaleDateString() || '—'

  return (
    <div style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: R, background: '#FFE8E8', padding: '2px 8px', borderRadius: 100 }}>{dirLabel}</span>
              {doc.contributionType === 'community' && <span style={{ fontSize: 11, color: '#0066CC', background: '#E6F2FF', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>🤝 Community Service</span>}
              {doc.contributionType === 'research' && <span style={{ fontSize: 11, color: '#228B22', background: '#E8F5E9', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>🔬 Research</span>}
              {doc.contributionType === 'publication' && <span style={{ fontSize: 11, color: '#FF9500', background: '#FFF8E8', padding: '2px 8px', borderRadius: 100, fontWeight: 600 }}>📚 Publication Track</span>}
              {doc.category && <span style={{ fontSize: 11, color: '#888', background: '#F4F4F0', padding: '2px 8px', borderRadius: 100 }}>{doc.category}</span>}
              {doc.sourceType && <span style={{ fontSize: 11, color: '#888' }}>{doc.sourceType}</span>}
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{doc.title || 'Untitled'}</h3>
            <div style={{ fontSize: 13, color: '#777', marginBottom: 8 }}>
              by {doc.author || 'Anonymous'} · {ts}
              {doc.wordCount ? ` · ${doc.wordCount.toLocaleString()} words` : ''}
              {doc.estimatedHours ? ` · ${doc.estimatedHours} contribution hrs` : ''}
            </div>
            {doc.sourceLink && (
              <a href={doc.sourceLink} target="_blank" rel="noreferrer"
                style={{ fontSize: 12, color: R, textDecoration: 'none', wordBreak: 'break-all' }}>
                ↗ {doc.sourceLink}
              </a>
            )}
          </div>
          <button onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: '1px solid #E8E4DF', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", color: '#555', flexShrink: 0 }}>
            {expanded ? 'Collapse' : 'View Translation'}
          </button>
        </div>

        {/* Preview */}
        {!expanded && doc.fullTranslation && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#FAFAF8', borderRadius: 8, fontSize: 13, color: '#555', lineHeight: 1.6, maxHeight: 60, overflow: 'hidden' }}>
            {doc.fullTranslation.slice(0, 200)}…
          </div>
        )}
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid #E8E4DF', padding: '20px 24px', background: '#FAFAF8' }}>
          <Section title="Full Translation" content={doc.fullTranslation} />
          {doc.terminologyNotes && <Section title="Terminology / Translation Notes" content={doc.terminologyNotes} />}
          {doc.reviewerVerification && <Section title="Reviewer Verification Notes" content={doc.reviewerVerification} />}
          {doc.researchMetadata && <Section title="Research / Contribution Metadata" content={doc.researchMetadata} />}
        </div>
      )}
    </div>
  )
}

function Section({ title, content }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 8 }}>{title}</div>
      <pre style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-wrap', margin: 0 }}>{content}</pre>
    </div>
  )
}
