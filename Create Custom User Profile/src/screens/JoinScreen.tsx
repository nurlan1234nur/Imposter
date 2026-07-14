import { useState, useRef } from 'react'
import Button from '../components/Button'

interface JoinScreenProps {
  onBack: () => void
  onJoined: (code: string) => void
}

export default function JoinScreen({ onBack, onJoined }: JoinScreenProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const joined = code.join('')

  const handleChar = (i: number, val: string) => {
    const ch = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
    const next = [...code]
    next[i] = ch
    setCode(next)
    setError('')
    if (ch && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) {
      refs.current[i - 1]?.focus()
      const next = [...code]
      next[i - 1] = ''
      setCode(next)
    }
    if (e.key === 'Enter' && joined.length === 6) handleJoin()
  }

  const handleJoin = () => {
    if (joined.length < 6) { setError('6 тэмдэгт оруулна уу'); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); onJoined(joined) }, 900)
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    if (text.length > 0) {
      const next = [...code]
      for (let i = 0; i < 6; i++) next[i] = text[i] || ''
      setCode(next)
      refs.current[Math.min(text.length, 5)]?.focus()
    }
    e.preventDefault()
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060A18',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid rgba(167,139,250,0.08)',
          background: 'rgba(6,10,24,0.88)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <button onClick={onBack} style={backBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#EEF2FF', margin: 0 }}>Өрөөнд нэгдэх</h1>
      </header>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          gap: 32,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 24,
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="6" width="18" height="12" rx="3" stroke="#A78BFA" strokeWidth="1.8" />
            <path d="M7 12H17M13 9L17 12L13 15" stroke="#A78BFA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#EEF2FF', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Өрөөний код оруул
          </h2>
          <p style={{ fontSize: 14, color: '#7886A8', margin: 0 }}>
            Найзаасаа 6 тэмдэгтийн кодыг аваарай
          </p>
        </div>

        {/* Code inputs */}
        <div style={{ display: 'flex', gap: 8 }}>
          {code.map((ch, i) => (
            <input
              key={i}
              ref={(el) => { refs.current[i] = el }}
              value={ch}
              onChange={(e) => handleChar(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              maxLength={1}
              style={{
                width: 46,
                height: 56,
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                background: ch
                  ? 'rgba(124,58,237,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: `2px solid ${ch ? 'rgba(124,58,237,0.5)' : error ? '#F87171' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 12,
                color: '#EEF2FF',
                outline: 'none',
                transition: 'border-color 0.15s, background 0.15s',
                caretColor: '#A78BFA',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#7C3AED'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = ch ? 'rgba(124,58,237,0.5)' : error ? '#F87171' : 'rgba(255,255,255,0.08)'
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p style={{ fontSize: 13, color: '#F87171', margin: '-16px 0', textAlign: 'center' }}>
            ⚠ {error}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleJoin}
          disabled={joined.length < 6 || loading}
          style={{ maxWidth: 320 }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <LoadSpinner /> Холбогдож байна...
            </span>
          ) : 'Нэгдэх →'}
        </Button>

        <p style={{ fontSize: 13, color: '#7886A8', textAlign: 'center' }}>
          Кодыг буулгаж тавьж болно
        </p>
      </div>
    </div>
  )
}

function LoadSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  )
}

const backBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10,
  padding: 8,
  color: '#C7D2FE',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  outline: 'none',
}
