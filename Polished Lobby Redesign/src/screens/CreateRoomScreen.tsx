import { useState, useRef } from 'react'
import type { AppCtx } from '../App'
import { games } from '../data/games'

interface Props { ctx: AppCtx }

// Fake QR code - visual placeholder
function FakeQR({ value, color }: { value: string; color: string }) {
  // Deterministic pattern based on value characters
  const cells: [number, number][] = []
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      // Corner markers
      const topLeft = r < 7 && c < 7
      const topRight = r < 7 && c >= 14
      const bottomLeft = r >= 14 && c < 7
      if (topLeft || topRight || bottomLeft) {
        const ro = topLeft ? r : topRight ? r : r - 14
        const co = topLeft ? c : topRight ? c - 14 : c
        if (ro === 0 || ro === 6 || co === 0 || co === 6) cells.push([r, c])
        else if (ro >= 2 && ro <= 4 && co >= 2 && co <= 4) cells.push([r, c])
        continue
      }
      // Data cells
      const hash = ((r * 31 + c) * 17 + value.charCodeAt((r + c) % value.length)) % 3
      if (hash === 0) cells.push([r, c])
    }
  }
  return (
    <svg viewBox="0 0 23 23" style={{ width: '100%', height: '100%' }}>
      <rect width="23" height="23" fill="white" rx="1" />
      <rect x="1" y="1" width="21" height="21" fill="white" />
      {cells.map(([r, c]) => (
        <rect key={`${r},${c}`} x={c + 1} y={r + 1} width="1" height="1" fill="#1a1a2e" />
      ))}
      {/* Center logo */}
      <rect x="9.5" y="9.5" width="4" height="4" rx="0.5" fill={color} />
    </svg>
  )
}

const STEP_LABELS = ['Тоглоом', 'Нэр', 'Тохиргоо', 'Төрөл', 'Бэлэн']

export default function CreateRoomScreen({ ctx }: Props) {
  const [step, setStep] = useState(ctx.selectedGameId ? 1 : 0)
  const [gameId, setGameId] = useState(ctx.selectedGameId ?? '')
  const [name, setName] = useState(ctx.playerName)
  const [playerCount, setPlayerCount] = useState(6)
  const [isPrivate, setIsPrivate] = useState(true)
  const [creating, setCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [copied, setCopied] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const game = games.find(g => g.id === gameId)

  const next = () => {
    if (step < 4) setStep(s => s + 1)
  }
  const prev = () => {
    if (step > 0) setStep(s => s - 1)
    else ctx.back()
  }

  const createRoom = () => {
    if (!name.trim()) return
    ctx.setPlayerName(name.trim())
    setCreating(true)
    const code = Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')
    setTimeout(() => {
      setRoomCode(code)
      ctx.setRoomCode(code)
      setCreating(false)
      setCreated(true)
      setStep(4)
    }, 1800)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareLink = `https://онлайн-өрөө.mn/join/${roomCode}`

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <button
          onClick={prev}
          style={{
            width: 40, height: 40, borderRadius: 12,
            background: '#131829', border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8', fontSize: 18, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</button>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', margin: 0 }}>
            Өрөө үүсгэх
          </h1>
        </div>
        <span style={{ fontSize: 12, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
          {step + 1} / {STEP_LABELS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: 'rgba(255,255,255,0.06)' }}>
        <div style={{
          height: '100%',
          width: `${((step + 1) / 5) * 100}%`,
          background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
          transition: 'width 0.4s cubic-bezier(.4,0,.2,1)',
        }} />
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '16px 0 20px' }}>
        {STEP_LABELS.map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: i < step ? '#7c3aed' : i === step ? 'linear-gradient(135deg,#7c3aed,#a78bfa)' : '#131829',
              border: i === step ? 'none' : i < step ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700,
              color: i <= step ? 'white' : '#475569',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: i === step ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
              transition: 'all 0.3s',
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 9, color: i === step ? '#a78bfa' : '#475569', fontFamily: "'Inter', sans-serif" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* STEP 0: Game selection */}
        {step === 0 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', marginBottom: 6 }}>
              Тоглоом сонгох
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>
              Өрөөндөө ямар тоглоом тоглохоо сонгоорой.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {games.map(g => (
                <button
                  key={g.id}
                  onClick={() => setGameId(g.id)}
                  className="press"
                  style={{
                    background: gameId === g.id
                      ? `linear-gradient(135deg, ${g.gradientFrom}, ${g.gradientTo})`
                      : '#131829',
                    border: gameId === g.id ? `1.5px solid ${g.color}60` : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 16, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer', textAlign: 'left', width: '100%',
                    boxShadow: gameId === g.id ? `0 0 16px ${g.color}30` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: gameId === g.id ? 'rgba(0,0,0,0.35)' : '#1a2035',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, border: gameId === g.id ? `1px solid ${g.color}30` : '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {g.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: 'white', marginBottom: 2 }}>
                      {g.name}
                    </div>
                    <div style={{ fontSize: 11, color: gameId === g.id ? 'rgba(255,255,255,0.6)' : '#475569', fontFamily: "'Inter', sans-serif" }}>
                      {g.players} тоглогч · {g.time}
                    </div>
                  </div>
                  {gameId === g.id && (
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: g.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, color: 'white', fontWeight: 800,
                    }}>✓</div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={!gameId}
              className="press"
              style={{
                width: '100%', height: 54, marginTop: 24,
                background: gameId ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : '#131829',
                border: gameId ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                color: gameId ? 'white' : '#475569', fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: gameId ? 'pointer' : 'not-allowed',
                boxShadow: gameId ? '0 0 24px rgba(124,58,237,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Үргэлжлүүлэх →
            </button>
          </div>
        )}

        {/* STEP 1: Player name */}
        {step === 1 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', marginBottom: 6 }}>
              Таны нэр
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
              Тоглоомд харагдах нэрээ оруулна уу.
            </p>
            {game && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', marginBottom: 24,
                background: `linear-gradient(135deg, ${game.gradientFrom}80, ${game.gradientTo}50)`,
                border: `1px solid ${game.color}30`, borderRadius: 14,
              }}>
                <span style={{ fontSize: 24 }}>{game.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: 'white' }}>{game.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif" }}>{game.players} тоглогч</div>
                </div>
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: 8 }}>
                ТОГЛОГЧИЙН НЭР
              </label>
              <input
                ref={nameRef}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Нэрээ оруулах..."
                maxLength={20}
                autoFocus
                style={{
                  width: '100%', height: 54,
                  background: '#131829',
                  border: name.trim() ? '1.5px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '0 16px',
                  color: '#f1f5f9', fontSize: 16, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                  boxShadow: name.trim() ? '0 0 12px rgba(124,58,237,0.2)' : 'none',
                  transition: 'all 0.2s',
                }}
              />
              <div style={{ fontSize: 11, color: '#475569', textAlign: 'right', marginTop: 6, fontFamily: "'Inter', sans-serif" }}>
                {name.length}/20
              </div>
            </div>
            {/* Avatar suggestion */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>
                АВАТАР СОНГОХ
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['🦊', '🐺', '🦅', '🐉', '🌙', '⚡', '🔮', '🎭'].map(av => (
                  <button key={av} style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: '#131829',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {av}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={next}
              disabled={!name.trim()}
              className="press"
              style={{
                width: '100%', height: 54,
                background: name.trim() ? 'linear-gradient(135deg, #7c3aed, #9333ea)' : '#131829',
                border: name.trim() ? 'none' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                color: name.trim() ? 'white' : '#475569', fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: name.trim() ? 'pointer' : 'not-allowed',
                boxShadow: name.trim() ? '0 0 24px rgba(124,58,237,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              Үргэлжлүүлэх →
            </button>
          </div>
        )}

        {/* STEP 2: Room settings */}
        {step === 2 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', marginBottom: 6 }}>
              Тохиргоо
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
              Тоглоомын тохиргоогоо оруулна уу.
            </p>

            {/* Player count */}
            <div style={{ background: '#131829', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 18px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 4 }}>
                Тоглогчдын тоо
              </div>
              {game && (
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
                  {game.name}: {game.players} тоглогч хамгийн тохиромжтой
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, justifyContent: 'center' }}>
                <button
                  onClick={() => setPlayerCount(c => Math.max((game?.playersMin ?? 4), c - 1))}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#a78bfa', fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300,
                  }}
                >−</button>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 32, color: '#f1f5f9', minWidth: 40, textAlign: 'center' }}>
                  {playerCount}
                </span>
                <button
                  onClick={() => setPlayerCount(c => Math.min((game?.playersMax ?? 12), c + 1))}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: '#1a2035', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#a78bfa', fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 300,
                  }}
                >+</button>
              </div>
            </div>

            {/* Quick role options */}
            <div style={{ background: '#131829', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 18px', marginBottom: 24 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 12 }}>
                Тусгай дүрүүд
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {game?.roles.filter(r => r.team !== 'good').map(role => (
                  <div key={role.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{role.icon}</span>
                      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>{role.name}</span>
                    </div>
                    <div style={{
                      width: 44, height: 26, borderRadius: 13,
                      background: 'rgba(124,58,237,0.3)',
                      border: '1px solid rgba(124,58,237,0.4)',
                      position: 'relative', cursor: 'pointer',
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: '50%',
                        background: '#a78bfa',
                        position: 'absolute', top: 3, right: 3,
                        transition: 'transform 0.2s',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={next}
              className="press"
              style={{
                width: '100%', height: 54,
                background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                border: 'none', borderRadius: 16,
                color: 'white', fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
                boxShadow: '0 0 24px rgba(124,58,237,0.4)',
              }}
            >
              Үргэлжлүүлэх →
            </button>
          </div>
        )}

        {/* STEP 3: Room type */}
        {step === 3 && (
          <div className="fade-up">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: '#f1f5f9', marginBottom: 6 }}>
              Өрөөний төрөл
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24, fontFamily: "'Inter', sans-serif" }}>
              Өрөөгөө нийтэд нээлттэй эсвэл хувийн байдлаар үүсгэнэ үү.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                {
                  priv: true, icon: '🔒', title: 'Хувийн өрөө',
                  desc: 'Зөвхөн урилга авсан найзууд нэгдэж чадна. Код болон холбоосоор урих боломжтой.',
                },
                {
                  priv: false, icon: '🌐', title: 'Нийтийн өрөө',
                  desc: 'Хэн ч тоглоомонд нэгдэж болно. Тоглогч хурдан хурдан олоход тохиромжтой.',
                },
              ].map(opt => (
                <button
                  key={String(opt.priv)}
                  onClick={() => setIsPrivate(opt.priv)}
                  className="press"
                  style={{
                    background: isPrivate === opt.priv ? 'rgba(124,58,237,0.15)' : '#131829',
                    border: isPrivate === opt.priv ? '1.5px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 18, padding: '18px 18px',
                    textAlign: 'left', cursor: 'pointer', width: '100%',
                    boxShadow: isPrivate === opt.priv ? '0 0 16px rgba(124,58,237,0.2)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <span style={{ fontSize: 28 }}>{opt.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 5 }}>
                        {opt.title}
                      </div>
                      <div style={{ fontSize: 12.5, color: '#64748b', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                        {opt.desc}
                      </div>
                    </div>
                    {isPrivate === opt.priv && (
                      <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white', fontWeight: 800, flexShrink: 0 }}>✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={createRoom}
              disabled={creating}
              className="press"
              style={{
                width: '100%', height: 54,
                background: creating ? '#131829' : 'linear-gradient(135deg, #7c3aed, #9333ea)',
                border: creating ? '1px solid rgba(255,255,255,0.1)' : 'none',
                borderRadius: 16,
                color: creating ? '#64748b' : 'white', fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
                cursor: creating ? 'not-allowed' : 'pointer',
                boxShadow: creating ? 'none' : '0 0 24px rgba(124,58,237,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                transition: 'all 0.3s',
              }}
            >
              {creating ? (
                <>
                  <div style={{ width: 18, height: 18, border: '2px solid #64748b', borderTopColor: '#a78bfa', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Өрөө үүсгэж байна...
                </>
              ) : '🏠 Өрөө үүсгэх'}
            </button>
          </div>
        )}

        {/* STEP 4: Room created - success */}
        {step === 4 && created && (
          <div className="fade-up" style={{ textAlign: 'center' }}>
            {/* Success icon */}
            <div className="bounce-in" style={{
              width: 80, height: 80, borderRadius: '50%', margin: '8px auto 20px',
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 0 40px rgba(124,58,237,0.5)',
            }}>
              🎉
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 24, color: '#f1f5f9', marginBottom: 6 }}>
              Өрөө үүслээ!
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, fontFamily: "'Inter', sans-serif" }}>
              Найзуудаа урихад бэлэн.
            </p>

            {/* Room code */}
            <div style={{
              background: '#131829',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 20, padding: '20px',
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.1em', marginBottom: 10, fontFamily: "'Inter', sans-serif" }}>
                ӨРӨӨНИЙ КОД
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 900,
                fontSize: 38, letterSpacing: '0.18em',
                background: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', marginBottom: 14,
              }}>
                {roomCode}
              </div>
              <button
                onClick={copyCode}
                style={{
                  padding: '10px 28px',
                  background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                  border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
                  borderRadius: 12,
                  fontSize: 13, fontWeight: 600,
                  color: copied ? '#10b981' : '#a78bfa',
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Хуулагдлаа' : '📋 Код хуулах'}
              </button>
            </div>

            {/* QR Code */}
            <div style={{
              background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 20, padding: '20px', marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.1em', marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>
                QR КОД
              </div>
              <div style={{ width: 140, height: 140, margin: '0 auto 14px', borderRadius: 12, overflow: 'hidden', padding: 8, background: 'white' }}>
                <FakeQR value={roomCode} color={game?.color ?? '#7c3aed'} />
              </div>
              <div style={{ fontSize: 11, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                QR код уншуулж нэгдэнэ
              </div>
            </div>

            {/* Share link */}
            <div style={{
              background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16, padding: '14px 16px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 12, flex: 1, color: '#64748b', fontFamily: "'Inter', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>
                🔗 {shareLink}
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(shareLink).catch(() => {})}
                style={{
                  flexShrink: 0, padding: '7px 12px',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: 10, fontSize: 11, fontWeight: 600,
                  color: '#a78bfa', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Хуулах
              </button>
            </div>

            <button
              onClick={() => ctx.navigate('waiting-room', { roomCode })}
              className="press"
              style={{
                width: '100%', height: 56,
                background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
                border: 'none', borderRadius: 16,
                color: 'white', fontSize: 16, fontWeight: 700,
                fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
                boxShadow: '0 0 28px rgba(124,58,237,0.5)',
              }}
            >
              🚪 Өрөө рүү орох
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
