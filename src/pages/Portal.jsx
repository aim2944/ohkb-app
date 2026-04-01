import { useState, useEffect, createContext, useContext } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { auth, db, signInAnonymously, onAuthStateChanged } from '../lib/firebase'
import Dashboard from './Dashboard'
import Translate from './Translate'
import SubmitAudit from './SubmitAudit'
import Registry from './Registry'

export const PortalCtx = createContext({})

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',            icon: '◈' },
  { id: 'translate',  label: 'Translation Engine',    icon: '⟺' },
  { id: 'submit',     label: 'Submit Contribution',   icon: '✦' },
  { id: 'registry',  label: 'Global Research Registry', icon: '◉' },
]

export default function Portal() {
  const [user, setUser]           = useState(null)
  const [pending, setPending]     = useState(null) // pre-filled translation data
  const [mobileOpen, setMobile]  = useState(false)
  const nav = useNavigate()
  const loc = useLocation()

  const activeTab = loc.pathname.split('/portal/')[1]?.split('/')[0] || 'dashboard'

  useEffect(() => {
    if (!auth) return
    const unsub = onAuthStateChanged(auth, u => {
      if (u) { setUser(u) }
      else { signInAnonymously(auth).catch(console.warn) }
    })
    return unsub
  }, [])

  const go = tab => { nav(`/portal/${tab}`); setMobile(false) }

  return (
    <PortalCtx.Provider value={{ user, db, pending, setPending }}>
      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Outfit', sans-serif" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 256, background: '#0f0f0f', color: 'white',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        }} className="portal-sidebar">
          <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid #222' }}>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#BB0000', marginBottom: 4 }}>OHKB</div>
            <div style={{ fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>Research Portal</div>
          </div>

          <nav style={{ flex: 1, padding: '16px 12px' }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => go(n.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                  padding: '11px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: activeTab === n.id ? '#BB0000' : 'transparent',
                  color: activeTab === n.id ? 'white' : '#888',
                  fontSize: 14, fontWeight: activeTab === n.id ? 600 : 400,
                  textAlign: 'left', marginBottom: 2, fontFamily: "'Outfit', sans-serif",
                  transition: 'background 0.15s, color 0.15s',
                }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #1a1a1a' }}>
            <button onClick={() => nav('/')}
              style={{ fontSize: 13, color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              ← Back to Site
            </button>
          </div>
        </aside>

        {/* ── MOBILE TOP BAR ── */}
        <div className="portal-mobile-bar" style={{ display: 'none', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: '#0f0f0f', borderBottom: '1px solid #222', height: 56, alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", color: '#BB0000', fontSize: 18 }}>OHKB</span>
          <button onClick={() => setMobile(o => !o)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20 }}>☰</button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }}>
            <div onClick={() => setMobile(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 256, background: '#0f0f0f', display: 'flex', flexDirection: 'column', padding: '20px 12px' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 20, color: '#BB0000', marginBottom: 20, padding: '0 12px' }}>OHKB</div>
              {NAV.map(n => (
                <button key={n.id} onClick={() => go(n.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: activeTab === n.id ? '#BB0000' : 'transparent', color: activeTab === n.id ? 'white' : '#888', fontSize: 14, textAlign: 'left', marginBottom: 4, fontFamily: "'Outfit', sans-serif" }}>
                  <span>{n.icon}</span>{n.label}
                </button>
              ))}
              <button onClick={() => nav('/')} style={{ fontSize: 13, color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '12px 14px', textAlign: 'left', marginTop: 'auto', fontFamily: "'Outfit', sans-serif" }}>← Back to Site</button>
            </div>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, background: '#FAF8F5', overflowY: 'auto' }} className="portal-main">
          <Routes>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<Dashboard />} />
            <Route path="translate"  element={<Translate />} />
            <Route path="submit"     element={<SubmitAudit />} />
            <Route path="registry"   element={<Registry />} />
            <Route path="*"          element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .portal-sidebar    { display: none !important; }
          .portal-mobile-bar { display: flex !important; }
          .portal-main       { padding-top: 56px; }
        }
      `}</style>
    </PortalCtx.Provider>
  )
}
