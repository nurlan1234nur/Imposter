import { useState, useEffect } from 'react'
import Button from '../components/Button'

type Phase = 'setup' | 'night' | 'day' | 'voting' | 'result'
type Role = 'mafia' | 'detective' | 'doctor' | 'civilian' | 'yashka'

interface Player {
  id: string
  name: string
  role: Role
  alive: boolean
  saved?: boolean
  investigated?: boolean
}

interface MafiaSetupProps {
  onBack: () => void
  onStart: (cfg: MafiaConfig) => void
}

interface MafiaConfig {
  mafiaCount: number
  detectiveCount: number
  doctorCount: number
  yashka: boolean
  dayDuration: number
  nightDuration: number
  mafiaCanSkip: boolean
  maxSkips: number
}

export function MafiaSetupScreen({ onBack, onStart }: MafiaSetupProps) {
  const [cfg, setCfg] = useState<MafiaConfig>({
    mafiaCount: 2,
    detectiveCount: 1,
    doctorCount: 1,
    yashka: false,
    dayDuration: 5,
    nightDuration: 5,
    mafiaCanSkip: true,
    maxSkips: 1,
  })

  const set = (k: keyof MafiaConfig, v: number | boolean) =>
    setCfg((prev) => ({ ...prev, [k]: v }))

  return (
    <div style={{ minHeight: '100vh', background: '#060A18', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      <header style={headerStyle}>
        <button onClick={onBack} style={backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <p style={{ margin: 0, fontSize: 11, color: '#7886A8' }}>🎭 Мафиа</p>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#EEF2FF' }}>Тохиргоо</h1>
        </div>
      </header>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Roles */}
        <Card title="Дүрүүдийн тоо">
          <RoleRow emoji="🔴" role="Мафиа" value={cfg.mafiaCount} min={1} max={6} onChange={(v) => set('mafiaCount', v)} />
          <RoleRow emoji="🔵" role="Мөрдөгч" value={cfg.detectiveCount} min={0} max={3} onChange={(v) => set('detectiveCount', v)} />
          <RoleRow emoji="🟢" role="Эмч" value={cfg.doctorCount} min={0} max={3} onChange={(v) => set('doctorCount', v)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span>🟡</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>Яшка</p>
                <p style={{ margin: 0, fontSize: 11, color: '#7886A8' }}>Мафиагийн талд тооцно</p>
              </div>
            </div>
            <ToggleSwitch value={cfg.yashka} onChange={(v) => set('yashka', v)} />
          </div>
        </Card>

        {/* Timer */}
        <Card title="Хугацааны тохиргоо">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>Өдрийн хугацаа</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <MiniStepBtn onClick={() => set('dayDuration', Math.max(1, cfg.dayDuration - 1))}>−</MiniStepBtn>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#EEF2FF', fontFamily: 'var(--font-mono)', minWidth: 60, textAlign: 'center' }}>
                {cfg.dayDuration} мин
              </span>
              <MiniStepBtn onClick={() => set('dayDuration', Math.min(15, cfg.dayDuration + 1))}>+</MiniStepBtn>
            </div>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.04)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <p style={{ margin: 0, fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>Шөнийн хугацаа</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <MiniStepBtn onClick={() => set('nightDuration', Math.max(1, cfg.nightDuration - 1))}>−</MiniStepBtn>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#EEF2FF', fontFamily: 'var(--font-mono)', minWidth: 60, textAlign: 'center' }}>
                {cfg.nightDuration} мин
              </span>
              <MiniStepBtn onClick={() => set('nightDuration', Math.min(15, cfg.nightDuration + 1))}>+</MiniStepBtn>
            </div>
          </div>
        </Card>

        {/* Rules */}
        <Card title="Тусгай дүрэм">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>Мафиа алалтыг алгасах</p>
              <p style={{ margin: 0, fontSize: 11, color: '#7886A8' }}>Хэрэв идэвхтэй бол нэг тоглоомд {cfg.maxSkips}x алгасаж болно</p>
            </div>
            <ToggleSwitch value={cfg.mafiaCanSkip} onChange={(v) => set('mafiaCanSkip', v)} />
          </div>
        </Card>
      </div>

      <div style={stickyFooter}>
        <Button variant="primary" size="lg" fullWidth onClick={() => onStart(cfg)}>
          🌙 Тоглоом эхлүүлэх
        </Button>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
// GAME PHASES
// ────────────────────────────────────────────

const SAMPLE_PLAYERS: Player[] = [
  { id: '1', name: 'Болд', role: 'mafia', alive: true },
  { id: '2', name: 'Оюун', role: 'detective', alive: true },
  { id: '3', name: 'Ганаа', role: 'doctor', alive: true },
  { id: '4', name: 'Мөнх', role: 'civilian', alive: true },
  { id: '5', name: 'Номин', role: 'mafia', alive: true },
  { id: '6', name: 'Эрдэнэ', role: 'civilian', alive: true },
  { id: '7', name: 'Сүрэн', role: 'civilian', alive: true },
]

interface MafiaGameProps {
  onBack: () => void
}

export function MafiaGameScreen({ onBack }: MafiaGameProps) {
  const [phase, setPhase] = useState<Phase>('night')
  const [round, setRound] = useState(1)
  const [players, setPlayers] = useState<Player[]>(SAMPLE_PLAYERS)
  const [timeLeft, setTimeLeft] = useState(30)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [eliminatedId, setEliminatedId] = useState<string | null>(null)
  const [votes, setVotes] = useState<Record<string, string>>({})
  const [nightResult, setNightResult] = useState<{ killed: string | null; saved: boolean }>({ killed: null, saved: false })
  const [winner, setWinner] = useState<'town' | 'mafia' | null>(null)

  const alive = players.filter((p) => p.alive)
  const mafiaAlive = alive.filter((p) => p.role === 'mafia' || p.role === 'yashka').length
  const townAlive = alive.filter((p) => p.role !== 'mafia' && p.role !== 'yashka').length

  useEffect(() => {
    if (phase === 'result') return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, round])

  const progressPct = (timeLeft / 30) * 100

  const handleNightEnd = () => {
    const killed = selectedTarget
    const savedPlayer = players.find((p) => p.id === killed && p.saved)
    if (killed && !savedPlayer) {
      setPlayers((prev) => prev.map((p) => p.id === killed ? { ...p, alive: false } : p))
    }
    setNightResult({ killed: killed ? players.find((p) => p.id === killed)?.name || null : null, saved: !!savedPlayer })
    setSelectedTarget(null)
    setPhase('day')
    setTimeLeft(60)
  }

  const handleVote = (targetId: string) => {
    setVotes((prev) => ({ ...prev, me: targetId }))
    setEliminatedId(targetId)
  }

  const handleEliminate = () => {
    if (!eliminatedId) return
    setPlayers((prev) => prev.map((p) => p.id === eliminatedId ? { ...p, alive: false } : p))
    const remaining = players.map((p) => p.id === eliminatedId ? { ...p, alive: false } : p)
    const ma = remaining.filter((p) => p.alive && (p.role === 'mafia' || p.role === 'yashka')).length
    const ta = remaining.filter((p) => p.alive && p.role !== 'mafia' && p.role !== 'yashka').length
    if (ma === 0) { setWinner('town'); setPhase('result'); return }
    if (ma >= ta) { setWinner('mafia'); setPhase('result'); return }
    setEliminatedId(null)
    setVotes({})
    setRound((r) => r + 1)
    setPhase('night')
    setTimeLeft(30)
  }

  if (phase === 'result') {
    return <ResultScreen winner={winner!} players={players} round={round} onBack={onBack} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#060A18', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      {/* Phase header */}
      <div
        style={{
          background: phase === 'night'
            ? 'linear-gradient(180deg, #0d0420 0%, #060A18 100%)'
            : 'linear-gradient(180deg, #1a0a05 0%, #060A18 100%)',
          padding: '20px 20px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Stars for night */}
        {phase === 'night' && (
          <div style={{ position: 'absolute', inset: 0 }}>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: Math.random() * 2 + 1,
                  height: Math.random() * 2 + 1,
                  borderRadius: '50%',
                  background: '#A78BFA',
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.2,
                }}
              />
            ))}
          </div>
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 28 }}>{phase === 'night' ? '🌙' : phase === 'day' ? '☀️' : '🗳️'}</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: phase === 'night' ? '#A78BFA' : '#F59E0B', fontWeight: 600 }}>
                  {round}-р ээлж
                </p>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#EEF2FF' }}>
                  {phase === 'night' ? 'Шөнийн үе' : phase === 'day' ? 'Өдрийн хэлэлцүүлэг' : 'Санал хураалт'}
                </h2>
              </div>
            </div>
            <button onClick={onBack} style={{ ...backBtn, background: 'rgba(0,0,0,0.3)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPct}%`,
                  background: phase === 'night' ? 'linear-gradient(90deg, #7C3AED, #A78BFA)' : 'linear-gradient(90deg, #D97706, #F59E0B)',
                  borderRadius: 3,
                  transition: 'width 1s linear',
                }}
              />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#EEF2FF', fontFamily: 'var(--font-mono)', minWidth: 36 }}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Night result banner */}
        {phase === 'day' && nightResult.killed && (
          <div
            style={{
              background: nightResult.saved ? 'rgba(52,211,153,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${nightResult.saved ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: 14,
              padding: '12px 16px',
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: nightResult.saved ? '#34D399' : '#F87171', fontWeight: 600 }}>
              {nightResult.saved
                ? `🟢 ${nightResult.killed} аврагдлаа — Эмч хамгааллаа`
                : `🔴 ${nightResult.killed} алагдлаа`}
            </p>
          </div>
        )}

        {/* Score */}
        <div style={{ display: 'flex', gap: 10 }}>
          <ScoreCard label="Иргэд" count={townAlive} color="#818CF8" />
          <ScoreCard label="Мафиа" count={mafiaAlive} color="#F87171" />
        </div>

        {/* Night action */}
        {phase === 'night' && (
          <div style={{ background: '#0C1428', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: 16 }}>
            <p style={{ ...secLabel, marginBottom: 12 }}>🔴 Мафиагийн зорилт</p>
            <p style={{ fontSize: 13, color: '#7886A8', marginBottom: 14 }}>Аллагад онилох тоглогч сонгоно уу:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alive.filter((p) => p.role !== 'mafia').map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedTarget(selectedTarget === p.id ? null : p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: selectedTarget === p.id ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedTarget === p.id ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    outline: 'none',
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg,#374151,#1f2937)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#D1D5DB',
                    }}
                  >
                    {p.name[0]}
                  </div>
                  <span style={{ flex: 1, fontSize: 14, color: '#EEF2FF', fontWeight: 600 }}>{p.name}</span>
                  {selectedTarget === p.id && <span style={{ color: '#F87171', fontSize: 16 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day: player list */}
        {phase === 'day' && (
          <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: 16 }}>
            <p style={{ ...secLabel, marginBottom: 12 }}>Амьд тоглогчид</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {alive.map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                  <span style={{ fontSize: 13, color: '#C7D2FE' }}>{p.name}</span>
                </div>
              ))}
              {players.filter((p) => !p.alive).map((p) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 10px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    opacity: 0.4,
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4B5563' }} />
                  <span style={{ fontSize: 13, color: '#7886A8', textDecoration: 'line-through' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voting */}
        {phase === 'voting' && (
          <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: 16 }}>
            <p style={{ ...secLabel, marginBottom: 12 }}>Санал хураалт — хэнийг гаргах вэ?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {alive.map((p) => {
                const voteCount = Object.values(votes).filter((v) => v === p.id).length
                return (
                  <button
                    key={p.id}
                    onClick={() => handleVote(p.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      borderRadius: 12,
                      background: eliminatedId === p.id ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${eliminatedId === p.id ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.06)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      outline: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg,#374151,#1f2937)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#D1D5DB',
                      }}
                    >
                      {p.name[0]}
                    </div>
                    <span style={{ flex: 1, fontSize: 15, color: '#EEF2FF', fontWeight: 600 }}>{p.name}</span>
                    {voteCount > 0 && (
                      <span
                        style={{
                          background: 'rgba(239,68,68,0.15)',
                          color: '#F87171',
                          border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: 20,
                          padding: '2px 10px',
                          fontSize: 12,
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {voteCount} санал
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div style={stickyFooter}>
        {phase === 'night' && (
          <Button variant="primary" size="lg" fullWidth onClick={handleNightEnd}>
            🌙 Шөнийг дуусгах
          </Button>
        )}
        {phase === 'day' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="ghost" size="md" style={{ flex: 1 }} onClick={() => { setPhase('voting'); setTimeLeft(60) }}>
              🗳️ Санал хураалт
            </Button>
            <Button variant="secondary" size="md" style={{ flex: 1 }} onClick={() => { setPhase('night'); setRound((r) => r + 1); setTimeLeft(30); setNightResult({ killed: null, saved: false }) }}>
              🌙 Шөнийн үед
            </Button>
          </div>
        )}
        {phase === 'voting' && (
          <Button variant="danger" size="lg" fullWidth disabled={!eliminatedId} onClick={handleEliminate}>
            Гаргах → {eliminatedId ? players.find((p) => p.id === eliminatedId)?.name : '...'}
          </Button>
        )}
      </div>
    </div>
  )
}

function ResultScreen({ winner, players, round, onBack }: { winner: 'town' | 'mafia'; players: Player[]; round: number; onBack: () => void }) {
  const isTown = winner === 'town'
  return (
    <div
      style={{
        minHeight: '100vh',
        background: isTown
          ? 'radial-gradient(ellipse at 50% 20%, #0d2b4a 0%, #060A18 60%)'
          : 'radial-gradient(ellipse at 50% 20%, #2b0d0d 0%, #060A18 60%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        gap: 28,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 72 }}>{isTown ? '🏛️' : '🔴'}</div>
      <div>
        <p style={{ fontSize: 13, color: '#7886A8', margin: '0 0 8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {round} давааны дараа
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em', color: '#EEF2FF', margin: '0 0 8px' }}>
          {isTown ? 'Иргэд хожлоо!' : 'Мафиа хожлоо!'}
        </h1>
        <p style={{ fontSize: 16, color: '#7886A8', margin: 0 }}>
          {isTown ? 'Мафиагийн бүх гишүүд олдлоо' : 'Мафиа хотыг эзлэлээ'}
        </p>
      </div>

      {/* Role reveal */}
      <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p style={{ fontSize: 11, color: '#7886A8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 8px' }}>
          Дүрүүд
        </p>
        {players.map((p) => (
          <div
            key={p.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              opacity: p.alive ? 1 : 0.5,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.alive ? '#34D399' : '#4B5563' }} />
              <span style={{ fontSize: 14, color: p.alive ? '#EEF2FF' : '#7886A8', fontWeight: 600 }}>
                {p.name}
              </span>
            </div>
            <RoleBadge role={p.role} />
          </div>
        ))}
      </div>

      <Button variant="primary" size="lg" onClick={onBack}>
        Дахин тоглох
      </Button>
    </div>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const map: Record<Role, { label: string; color: string }> = {
    mafia: { label: 'Мафиа', color: '#F87171' },
    detective: { label: 'Мөрдөгч', color: '#60A5FA' },
    doctor: { label: 'Эмч', color: '#34D399' },
    civilian: { label: 'Иргэн', color: '#A78BFA' },
    yashka: { label: 'Яшка', color: '#F59E0B' },
  }
  const r = map[role]
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: r.color,
        background: `${r.color}18`,
        border: `1px solid ${r.color}30`,
        borderRadius: 6,
        padding: '2px 8px',
        fontFamily: 'var(--font-mono)',
      }}
    >
      {r.label}
    </span>
  )
}

function ScoreCard({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: '#0C1428',
        border: `1px solid ${color}18`,
        borderRadius: 14,
        padding: '12px 14px',
        textAlign: 'center',
      }}
    >
      <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{count}</p>
      <p style={{ margin: 0, fontSize: 12, color: '#7886A8', fontWeight: 600 }}>{label}</p>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: 16 }}>
      <p style={{ ...secLabel, marginBottom: 14 }}>{title}</p>
      {children}
    </div>
  )
}

function RoleRow({ emoji, role, value, min, max, onChange }: { emoji: string; role: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>{emoji}</span>
        <span style={{ fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>{role}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <MiniStepBtn onClick={() => onChange(Math.max(min, value - 1))}>−</MiniStepBtn>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#EEF2FF', fontFamily: 'var(--font-mono)', minWidth: 20, textAlign: 'center' }}>{value}</span>
        <MiniStepBtn onClick={() => onChange(Math.min(max, value + 1))}>+</MiniStepBtn>
      </div>
    </div>
  )
}

function MiniStepBtn({ children, onClick }: { children: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: 'rgba(124,58,237,0.12)',
        border: '1px solid rgba(124,58,237,0.25)',
        color: '#A78BFA',
        fontSize: 16,
        fontWeight: 700,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
      }}
    >
      {children}
    </button>
  )
}

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 24, borderRadius: 12, border: 'none',
        background: value ? 'linear-gradient(135deg,#7C3AED,#6366F1)' : 'rgba(255,255,255,0.1)',
        cursor: 'pointer', position: 'relative', transition: 'background 0.2s', outline: 'none', flexShrink: 0,
      }}
    >
      <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
    </button>
  )
}

const secLabel: React.CSSProperties = { margin: 0, fontSize: 11, fontWeight: 700, color: '#7886A8', letterSpacing: '0.08em', textTransform: 'uppercase' }
const headerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px',
  borderBottom: '1px solid rgba(167,139,250,0.08)',
  background: 'rgba(6,10,24,0.9)', backdropFilter: 'blur(16px)',
  position: 'sticky', top: 0, zIndex: 40,
}
const stickyFooter: React.CSSProperties = {
  position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
  width: '100%', maxWidth: 480, padding: '16px 20px',
  background: 'rgba(6,10,24,0.95)', backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(167,139,250,0.1)',
}
const backBtn: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 10, padding: 8, color: '#C7D2FE', cursor: 'pointer',
  display: 'flex', alignItems: 'center', outline: 'none',
}
