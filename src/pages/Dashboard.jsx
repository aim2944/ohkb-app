import { useContext, useEffect, useState } from 'react'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { PortalCtx } from './Portal'
import { useNavigate } from 'react-router-dom'

const R = '#BB0000'

export default function Dashboard() {
  const { user, db } = useContext(PortalCtx)
  const [docs, setDocs]   = useState([])
  const [ready, setReady] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!db || !user) { setReady(true); return }
    const q = query(
      collection(db, 'translations'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
    )
    const unsub = onSnapshot(q, snap => {
      setDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setReady(true)
    }, () => setReady(true))
    return unsub
  }, [db, user])

  const totalWords     = docs.reduce((a, d) => a + (d.wordCount || 0), 0)
  const totalHours     = (totalWords / 1000).toFixed(1)

  // Separate hours by contribution type
  const communityDocs  = docs.filter(d => d.contributionType === 'community')
  const researchDocs   = docs.filter(d => d.contributionType === 'research')
  const publicationDocs = docs.filter(d => d.contributionType === 'publication')

  const communityWords = communityDocs.reduce((a, d) => a + (d.wordCount || 0), 0)
  const researchWords  = researchDocs.reduce((a, d) => a + (d.wordCount || 0), 0)
  const publicationWords = publicationDocs.reduce((a, d) => a + (d.wordCount || 0), 0)

  const communityHours = (communityWords / 1000).toFixed(1)
  const researchHours  = (researchWords / 1000).toFixed(1)
  const publicationHours = (publicationWords / 1000).toFixed(1)

  const clinicalDocs   = docs.filter(d => d.category === 'Clinical Translation')
  const phDocs         = docs.filter(d => d.category === 'Public Health Education')
  const pubHealthHours = (phDocs.reduce((a, d) => a + (d.wordCount || 0), 0) / 1000).toFixed(1)

  const stats = [
    { label: 'Total Contributions', value: docs.length, unit: '', tooltip: 'All translations submitted' },
    { label: 'Community Service Hours', value: communityHours, unit: 'hrs', tooltip: 'Sourcing, translating, distributing research' },
    { label: 'Research Contribution Hours', value: researchHours, unit: 'hrs', tooltip: 'Analysis, systematic review, data synthesis' },
    { label: 'Publication Track Hours', value: publicationHours, unit: 'hrs', tooltip: 'Material for co-authored journal submission' },
    { label: 'Words Translated', value: totalWords.toLocaleString(), unit: '', tooltip: 'Total across all contributions' },
    { label: 'Impact Score', value: Math.round(totalWords / 100), unit: 'pts', tooltip: 'Public health education reach' },
  ]

  return (
    <div style={{ padding: '40px 48px', maxWidth: 960, margin: '0 auto' }} className="dash-pad">

      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: R, marginBottom: 8 }}>Research Portal</div>
        <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 36, marginBottom: 8 }}>Your Contribution Dashboard</h1>
        <p style={{ color: '#555', fontSize: 16 }}>Track your verified research contributions and impact hours for the Oromo Health Knowledge Bridge.</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 40 }} className="stats-grid">
        {stats.map(s => (
          <div key={s.label} title={s.tooltip} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 12, padding: '28px 24px', cursor: s.tooltip ? 'help' : 'default' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 38, color: R, lineHeight: 1, marginBottom: 6 }}>
              {ready ? s.value : '—'}{s.unit && <span style={{ fontSize: 16, marginLeft: 4 }}>{s.unit}</span>}
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }} className="actions-grid">
        <button onClick={() => nav('/portal/translate')}
          style={{ background: R, color: 'white', border: 'none', borderRadius: 12, padding: '24px 28px', textAlign: 'left', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>⟺</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Start a Translation</div>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Translate medical research or clinical documents English ↔ Afaan Oromo</div>
        </button>
        <button onClick={() => nav('/portal/registry')}
          style={{ background: 'white', color: '#111', border: '1px solid #E8E4DF', borderRadius: 12, padding: '24px 28px', textAlign: 'left', cursor: 'pointer', fontFamily: "'Outfit', sans-serif' " }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>◉</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Global Research Registry</div>
          <div style={{ fontSize: 13, color: '#555' }}>Browse all verified translations submitted by the OHKB network</div>
        </button>
      </div>

      {/* Recent contributions */}
      {docs.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 20 }}>Recent Contributions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {docs.slice(0, 5).map(d => (
              <div key={d.id} style={{ background: 'white', border: '1px solid #E8E4DF', borderRadius: 10, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{d.title || 'Untitled'}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>{d.sourceType} · {d.direction === 'en_or' ? 'EN→OR' : 'OR→EN'} · {d.wordCount || 0} words</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: R, fontWeight: 600 }}>{((d.wordCount || 0) / 1000).toFixed(2)} hrs</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{d.contributionType === 'community' ? '🤝 Community Service' : d.contributionType === 'research' ? '🔬 Research' : '📚 Publication Track'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Co-Authorship Eligibility Tracker */}
      <div style={{ background: '#F0F8FF', border: '1px solid #B0D4FF', borderRadius: 14, padding: '28px', marginBottom: 40 }}>
        <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 4 }}>📋 Co-Authorship Eligibility</h2>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>ICMJE criteria for journal co-authorship. Requires substantive analysis + manuscript contribution.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <div style={{ background: 'white', borderRadius: 10, padding: '16px' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Publication Papers</div>
            <div style={{ fontSize: 32, color: '#0066CC', fontWeight: 700 }}>{publicationDocs.length}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>Target: 1+ paper minimum</div>
          </div>
          <div style={{ background: 'white', borderRadius: 10, padding: '16px' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Publication Hours</div>
            <div style={{ fontSize: 32, color: '#0066CC', fontWeight: 700 }}>{publicationHours}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>All words count equally</div>
          </div>
          <div style={{ background: 'white', borderRadius: 10, padding: '16px' }}>
            <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>Status</div>
            <div style={{ fontSize: 24, marginTop: 6 }}>{publicationDocs.length > 0 ? '✓ Eligible' : '○ In Progress'}</div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 6 }}>Pending expert review</div>
          </div>
        </div>
      </div>

      {/* Publication Tracker */}
      {publicationDocs.length > 0 && (
        <div style={{ background: '#FFF8F0', border: '1px solid #FFD8A8', borderRadius: 14, padding: '28px', marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 22, marginBottom: 4 }}>📚 Publication Track Progress</h2>
          <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>Materials ready for review synthesis or co-authored publication</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div style={{ background: 'white', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: '#FF9500', fontWeight: 700, marginBottom: 4 }}>{publicationDocs.length}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Papers Ready</div>
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: '#FF9500', fontWeight: 700, marginBottom: 4 }}>{publicationHours}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Publication Hours</div>
            </div>
            <div style={{ background: 'white', borderRadius: 10, padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, color: '#FF9500', fontWeight: 700, marginBottom: 4 }}>{publicationWords.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: '#666' }}>Total Words</div>
            </div>
          </div>
        </div>
      )}

      {docs.length === 0 && ready && (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: '#999' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⟺</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#555', marginBottom: 8 }}>No contributions yet</div>
          <p style={{ margin: '0 0 24px' }}>Start translating medical research to build your research portfolio.</p>
          <button onClick={() => nav('/portal/translate')}
            style={{ background: R, color: 'white', border: 'none', borderRadius: 8, padding: '12px 28px', cursor: 'pointer', fontWeight: 600, fontSize: 15, fontFamily: "'Outfit', sans-serif" }}>
            Start Your First Translation
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dash-pad    { padding: 24px 20px !important; }
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
          .actions-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
