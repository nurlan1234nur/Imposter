import { useState, useRef } from 'react'
import type { AppCtx } from '../App'

interface Props { ctx: AppCtx }

type JoinState = 'idle' | 'loading' | 'error' | 'success'

export default function JoinRoomScreen({ ctx }: Props) {
  const [code, setCode] = useState(ctx.roomCode ?? '')
  const [name, setName] = useState(ctx.playerName)
  const [joinState, setJoinState] = useState<JoinState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const displayCode = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    setCode(v)
    if (joinState === 'error') setJoinState('idle')
  }

  const handleJoin = () => {
    if (displayCode.length !== 6 || !name.trim()) return
    setJoinState('loading')
    ctx.setPlayerName(name.trim())
    ctx.setRoomCode(displayCode)
    setTimeout(() => {
      // Simulate: code 'XXXXXX' always fails for demo
      if (displayCode === 'XXXXXX') {
        setJoinState('error')
        setErrorMsg('Өрөө олдсонгүй. Кодыг шалгана уу.')
      } else {
        setJoinState('success')
        setTimeout(() => ctx.navigate('waiting-room', { roomCode: displayCode }), 900)
      }
    }, 1800)
  }

  const canJoin = displayCode.length === 6 && name.trim().length > 0 && joinState !== 'loading'

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={ctx.back}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: '#131829', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', margin: 0 }}>
          Кодоор нэгдэх
        </h1>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '28px 24px', overflowY: 'auto' }}>

        {/* Mood illustration */}
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.08))',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 38, margin: '0 auto 20px',
          boxShadow: '0 0 30px rgba(124,58,237,0.2)',
        }}>
          🔑
        </div>

        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#f1f5f9', textAlign: 'center', marginBottom: 6 }}>
          Өрөөний код
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 32, fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
          Найзаас авсан 6 тэмдэгтийн кодыг оруулна уу.
        </p>

        {/* Code input - tap to show keyboard */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.1em', marginBottom: 12, fontFamily: "'Inter', sans-serif", textAlign: 'center' }}>
            ӨРӨӨНИЙ КОД
          </div>
          {/* Visual code boxes */}
          <div
            style={{ display: 'flex', gap: 8, justifyContent: 'center', cursor: 'text', position: 'relative' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Hidden actual input */}
            <input
              ref={inputRef}
              value={displayCode}
              onChange={handleCodeInput}
              onKeyDown={e => e.key === 'Enter' && canJoin && handleJoin()}
              style={{
                position: 'absolute', opacity: 0, pointerEvents: 'auto',
                width: 1, height: 1, left: '50%', top: '50%',
              }}
              autoCapitalize="characters"
              maxLength={6}
              inputMode="text"
            />
            {Array.from({ length: 6 }).map((_, i) => {
              const char = displayCode[i] ?? ''
              const isActive = i === displayCode.length && joinState !== 'loading'
              const hasError = joinState === 'error'
              return (
                <div
                  key={i}
                  style={{
                    width: 46, height: 58,
                    background: char ? 'rgba(124,58,237,0.12)' : '#131829',
                    border: hasError
                      ? '1.5px solid rgba(239,68,68,0.5)'
                      : isActive
                      ? '1.5px solid #7c3aed'
                      : char
                      ? '1.5px solid rgba(124,58,237,0.35)'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 900, fontSize: 22,
                    color: hasError ? '#ef4444' : '#f1f5f9',
                    boxShadow: isActive ? '0 0 12px rgba(124,58,237,0.3)' : 'none',
                    transition: 'all 0.15s',
                    position: 'relative',
                  }}
                >
                  {char || (isActive ? (
                    <div style={{
                      width: 2, height: 24, background: '#7c3aed',
                      animation: 'blink 1s step-end infinite', borderRadius: 1,
                    }} />
                  ) : null)}
                </div>
              )
            })}
          </div>

          {/* Error message */}
          {joinState === 'error' && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 12, padding: '10px 14px', marginTop: 14,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ fontSize: 13, color: '#fca5a5', fontFamily: "'Inter', sans-serif" }}>
                {errorMsg}
              </span>
            </div>
          )}

          {/* Success state */}
          {joinState === 'success' && (
            <div className="bounce-in" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 12, padding: '12px 14px', marginTop: 14,
            }}>
              <span style={{ fontSize: 18 }}>✅</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#6ee7b7', fontFamily: "'Inter', sans-serif" }}>
                Амжилттай нэгдлаа!
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 11, color: '#475569', fontFamily: "'Inter', sans-serif" }}>таны нэр</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Player name */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.1em', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: 10 }}>
            ТОГЛОГЧИЙН НЭР
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && canJoin && handleJoin()}
            placeholder="Нэрээ оруулах..."
            maxLength={20}
            style={{
              width: '100%', height: 54,
              background: '#131829',
              border: name.trim() ? '1.5px solid rgba(124,58,237,0.4)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '0 16px',
              color: '#f1f5f9', fontSize: 16, fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              boxShadow: name.trim() ? '0 0 10px rgba(124,58,237,0.15)' : 'none',
              transition: 'all 0.2s',
            }}
          />
        </div>

        {/* Hint */}
        <div style={{ fontSize: 11.5, color: '#475569', fontFamily: "'Inter', sans-serif", lineHeight: 1.6, marginBottom: 24 }}>
          💡 Холбоос байвал шууд нэгдэж болно — код дахин оруулах шаардлагагүй.
        </div>
      </div>

      {/* Sticky join button */}
      <div style={{
        padding: '12px 20px max(env(safe-area-inset-bottom),16px)',
        background: 'rgba(7,9,15,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Validation hints */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {[
            { ok: displayCode.length === 6, label: '6 тэмдэгт' },
            { ok: name.trim().length > 0, label: 'Нэр оруулсан' },
          ].map(hint => (
            <div key={hint.label} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 11, fontFamily: "'Inter', sans-serif",
              color: hint.ok ? '#10b981' : '#475569',
            }}>
              <span>{hint.ok ? '✓' : '○'}</span>
              <span>{hint.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className="press"
          style={{
            width: '100%', height: 56,
            background: canJoin ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : '#131829',
            border: canJoin ? 'none' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            color: canJoin ? 'white' : '#475569',
            fontSize: 16, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: canJoin ? 'pointer' : 'not-allowed',
            boxShadow: canJoin ? '0 0 28px rgba(124,58,237,0.5)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'all 0.2s',
          }}
        >
          {joinState === 'loading' ? (
            <>
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Нэгдэж байна...
            </>
          ) : '🔑 Нэгдэх'}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0; } }
      `}</style>
    </div>
  )
}
