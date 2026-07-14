import { useState } from 'react'
import type { Game } from '../data/games'
import Button from '../components/Button'
import Badge from '../components/Badge'

interface OfflineSetupScreenProps {
  game: Game
  onBack: () => void
  onStart: (players: string[]) => void
}

export default function OfflineSetupScreen({ game, onBack, onStart }: OfflineSetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(5)
  const [imposterCount, setImposterCount] = useState(1)
  const [names, setNames] = useState<string[]>(Array(5).fill(''))
  const [randomWord, setRandomWord] = useState(true)
  const [timerMode, setTimerMode] = useState(false)

  const updateCount = (val: number) => {
    const n = Math.max(3, Math.min(10, val))
    setPlayerCount(n)
    setNames((prev) => {
      const next = [...prev]
      while (next.length < n) next.push('')
      return next.slice(0, n)
    })
    if (imposterCount >= n) setImposterCount(n - 1)
  }

  const validNames = names.filter((n) => n.trim().length > 0)
  const canStart = validNames.length === playerCount

  return (
    <div style={{ minHeight: '100vh', background: '#060A18', display: 'flex', flexDirection: 'column', paddingBottom: 100 }}>
      {/* Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid rgba(167,139,250,0.08)',
          background: 'rgba(6,10,24,0.9)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <button onClick={onBack} style={backBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: '#EEF2FF', margin: 0 }}>{game.title}</h1>
            <Badge variant="offline" small />
          </div>
          <p style={{ fontSize: 11, color: '#7886A8', margin: 0 }}>Офлайн тохиргоо</p>
        </div>
      </header>

      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Counters */}
        <Card>
          <Row>
            <div>
              <p style={label}>Тоглогчийн тоо</p>
              <p style={sub}>{playerCount} хүн</p>
            </div>
            <Stepper value={playerCount} min={3} max={10} onChange={updateCount} />
          </Row>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
          <Row>
            <div>
              <p style={label}>Импостерийн тоо</p>
              <p style={sub}>Нуугдсан тоглогч</p>
            </div>
            <Stepper
              value={imposterCount}
              min={1}
              max={Math.floor(playerCount / 2)}
              onChange={setImposterCount}
            />
          </Row>
        </Card>

        {/* Special modes */}
        <Card>
          <p style={{ ...label, marginBottom: 12 }}>Тусгай горим</p>
          <Toggle
            label="Санамсаргүй үг"
            desc="Тоглоомыг өөр өөр үгээр баяжуулна"
            value={randomWord}
            onChange={setRandomWord}
          />
          <Toggle
            label="Таймер горим"
            desc="Хариулах хугацаа хязгаарлагдана"
            value={timerMode}
            onChange={setTimerMode}
          />
        </Card>

        {/* Player names */}
        <Card>
          <p style={{ ...label, marginBottom: 12 }}>Тоглогчдын нэр</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {names.map((n, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: n.trim()
                      ? 'linear-gradient(135deg, #7C3AED, #6366F1)'
                      : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: n.trim() ? '#fff' : '#7886A8',
                    flexShrink: 0,
                    transition: 'background 0.15s',
                  }}
                >
                  {n.trim() ? n[0].toUpperCase() : i + 1}
                </div>
                <input
                  value={n}
                  onChange={(e) => {
                    const next = [...names]
                    next[i] = e.target.value
                    setNames(next)
                  }}
                  placeholder={`${i + 1}-р тоглогч`}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${n.trim() ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    color: '#EEF2FF',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.15s',
                  }}
                />
              </div>
            ))}
          </div>
          {!canStart && (
            <p style={{ fontSize: 12, color: '#7886A8', marginTop: 10, textAlign: 'center' }}>
              Тоглогч бүрийн нэрийг оруулна уу ({validNames.length}/{playerCount})
            </p>
          )}
        </Card>
      </div>

      {/* CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          padding: '16px 20px',
          background: 'rgba(6,10,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(167,139,250,0.1)',
        }}
      >
        <Button
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canStart}
          onClick={() => onStart(names)}
        >
          🎮 Тоглоом эхлүүлэх
        </Button>
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: 16 }}>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{children}</div>
}

function Stepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <StepBtn disabled={value <= min} onClick={() => onChange(value - 1)}>−</StepBtn>
      <span style={{ fontSize: 20, fontWeight: 700, color: '#EEF2FF', minWidth: 28, textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
        {value}
      </span>
      <StepBtn disabled={value >= max} onClick={() => onChange(value + 1)}>+</StepBtn>
    </div>
  )
}

function StepBtn({ children, disabled, onClick }: { children: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(124,58,237,0.15)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.3)'}`,
        color: disabled ? '#4B5563' : '#A78BFA',
        fontSize: 18,
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        outline: 'none',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <p style={{ margin: 0, fontSize: 14, color: '#C7D2FE', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12, color: '#7886A8' }}>{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none',
          background: value ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer', position: 'relative', transition: 'background 0.2s', outline: 'none', flexShrink: 0,
        }}
      >
        <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
      </button>
    </div>
  )
}

const label: React.CSSProperties = { margin: 0, fontSize: 14, fontWeight: 600, color: '#C7D2FE' }
const sub: React.CSSProperties = { margin: '2px 0 0', fontSize: 12, color: '#7886A8' }
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
