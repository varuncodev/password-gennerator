import { useState, useCallback, useEffect, useRef } from 'react'

const charSets = {
  up: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lo: 'abcdefghijklmnopqrstuvwxyz',
  num: '0123456789',
  sym: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const strengthLevels = [
  { pct: 15,  color: '#ef4444', label: 'Weak' },
  { pct: 30,  color: '#f97316', label: 'Fair' },
  { pct: 50,  color: '#eab308', label: 'Moderate' },
  { pct: 70,  color: '#22c55e', label: 'Strong' },
  { pct: 85,  color: '#10b981', label: 'Very Strong' },
  { pct: 100, color: '#6366f1', label: 'Fortress' },
]

function getStrength(pass) {
  let score = 0
  if (pass.length >= 12) score++
  if (pass.length >= 20) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[a-z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  return strengthLevels[Math.min(score, strengthLevels.length - 1)]
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill="white" />
    </svg>
  )
}

function RegenIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none"
      stroke="currentColor" strokeWidth="2.5">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function ToggleCard({ label, sublabel, active, onToggle }) {
  return (
    <div onClick={onToggle} style={{
      background: active ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${active ? 'rgba(124,58,237,0.7)' : 'rgba(255,255,255,0.12)'}`,
      borderRadius: 12,
      padding: '12px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      userSelect: 'none',
      boxShadow: active ? '0 0 15px rgba(124,58,237,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
      transition: 'all 0.25s',
    }}>
      {/* Toggle pill */}
      <div style={{
        width: 34, height: 18, borderRadius: 9,
        background: active ? 'linear-gradient(90deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.1)',
        border: active ? 'none' : '1px solid rgba(255,255,255,0.1)',
        boxShadow: active ? '0 0 8px rgba(168,85,247,0.5)' : 'none',
        position: 'relative', flexShrink: 0, transition: 'all 0.25s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: 2,
          width: 12, height: 12, borderRadius: '50%',
          background: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          transform: active ? 'translateX(16px)' : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      {/* Label */}
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', lineHeight: 1.3,
        color: active ? '#c4b5fd' : '#8b7db0',
        transition: 'color 0.25s',
      }}>
        {label}<br />{sublabel}
      </div>
    </div>
  )
}

export default function App() {
  const [length, setLength] = useState(16)
  const [options, setOptions] = useState({ up: true, lo: true, num: false, sym: false })
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const passRef = useRef(null)

  const generate = useCallback(() => {
    let pool = ''
    const required = []
    ;['up', 'lo', 'num', 'sym'].forEach(k => {
      if (options[k]) { pool += charSets[k]; required.push(charSets[k]) }
    })
    if (!pool) { pool = charSets.lo; required.push(charSets.lo) }

    let chars = required.map(s => s[Math.floor(Math.random() * s.length)])
    while (chars.length < length) {
      chars.push(pool[Math.floor(Math.random() * pool.length)])
    }
    setPassword(chars.sort(() => Math.random() - 0.5).join('').slice(0, length))
  }, [length, options])

  useEffect(() => { generate() }, [generate])

  const copyPass = useCallback(() => {
    navigator.clipboard.writeText(password).catch(() => {
      passRef.current?.select()
      document.execCommand('copy')
    })
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }, [password])

  const toggleOption = (key) =>
    setOptions(prev => ({ ...prev, [key]: !prev[key] }))

  const strength = getStrength(password)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0614',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      {/* Google Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <div style={{
        width: '100%', maxWidth: 420,
        background: 'linear-gradient(145deg,#0f0a1a 0%,#1a1030 50%,#0d0818 100%)',
        borderRadius: 24,
        padding: '2rem',
        border: '1px solid rgba(124,58,237,0.3)',
        boxShadow: '0 0 0 1px rgba(124,58,237,0.1), 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Aurora glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.08) 0%, transparent 60%)',
        }} />

        {/* Dot grid decoration */}
        <svg style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, opacity: 0.04, pointerEvents: 'none' }}
          viewBox="0 0 120 120">
          <defs>
            <pattern id="dp" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="120" height="120" fill="url(#dp)" />
        </svg>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 48, height: 48, margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(124,58,237,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
            transform: 'perspective(200px) rotateX(10deg)',
          }}>
            <LockIcon />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e2d9f3', textShadow: '0 0 20px rgba(168,85,247,0.5)' }}>
            Vault Key
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: '#8b7db0', marginTop: 4, textTransform: 'uppercase' }}>
            Secure Password Generator
          </div>
        </div>

        {/* Password display */}
        <div style={{
          position: 'relative', zIndex: 1, marginBottom: '0.5rem',
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid rgba(124,58,237,0.4)`,
          borderRadius: 14,
          display: 'flex', alignItems: 'stretch',
          overflow: 'hidden',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.04), 0 4px 15px rgba(124,58,237,0.15)',
        }}>
          <input
            ref={passRef}
            type="text"
            value={password}
            readOnly
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '14px 16px',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
              color: '#c4b5fd', letterSpacing: '0.05em',
              textShadow: '0 0 8px rgba(196,181,253,0.4)',
            }}
          />

          {/* "COPIED" flash */}
          {copied && (
            <div style={{
              position: 'absolute', right: 76, top: '50%', transform: 'translateY(-50%)',
              fontSize: 9, letterSpacing: '0.1em', color: '#86efac',
              textShadow: '0 0 8px rgba(134,239,172,0.6)',
              pointerEvents: 'none',
            }}>
              COPIED
            </div>
          )}

          {/* Strength bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 72,
            height: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${strength.pct}%`,
              background: `linear-gradient(90deg, ${strength.color}, ${strength.color}cc)`,
              boxShadow: `0 0 6px ${strength.color}`,
              transition: 'width 0.4s ease, background 0.4s ease',
            }} />
          </div>

          <button onClick={copyPass} style={{
            background: 'linear-gradient(135deg,#7c3aed,#a855f7)',
            border: 'none', borderLeft: '1px solid rgba(255,255,255,0.1)',
            padding: '0 20px', color: 'white',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0, transition: 'opacity 0.2s',
          }}>
            <CopyIcon /> Copy
          </button>
        </div>

        {/* Strength label */}
        <div style={{
          fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
          textAlign: 'right', color: strength.color,
          textShadow: `0 0 8px ${strength.color}60`,
          marginBottom: '1.25rem', position: 'relative', zIndex: 1,
          height: 14, transition: 'color 0.3s',
        }}>
          {strength.label}
        </div>

        {/* Controls */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Length slider */}
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 12, padding: '14px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 10, fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8b7db0',
            }}>
              <span>Length</span>
              <span style={{ fontSize: 13, color: '#c4b5fd', textShadow: '0 0 8px rgba(196,181,253,0.3)' }}>
                {length}
              </span>
            </div>
            <input
              type="range" min={6} max={64} step={1} value={length}
              onChange={e => setLength(Number(e.target.value))}
              style={{
                WebkitAppearance: 'none', appearance: 'none',
                width: '100%', height: 4,
                background: `linear-gradient(to right, #7c3aed ${((length - 6) / 58) * 100}%, rgba(255,255,255,0.08) 0%)`,
                borderRadius: 2, outline: 'none', cursor: 'pointer',
                border: 'none',
              }}
            />
          </div>

          {/* Toggle options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <ToggleCard label="Uppercase" sublabel="A–Z" active={options.up} onToggle={() => toggleOption('up')} />
            <ToggleCard label="Lowercase" sublabel="a–z" active={options.lo} onToggle={() => toggleOption('lo')} />
            <ToggleCard label="Numbers" sublabel="0–9" active={options.num} onToggle={() => toggleOption('num')} />
            <ToggleCard label="Symbols" sublabel="!@#$%" active={options.sym} onToggle={() => toggleOption('sym')} />
          </div>

          {/* Regenerate */}
          <button onClick={generate} style={{
            width: '100%', padding: 13,
            background: 'transparent',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: 12, color: '#c4b5fd',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8,
            transition: 'all 0.25s',
          }}>
            <RegenIcon /> Regenerate
          </button>
        </div>
      </div>
    </div>
  )
}