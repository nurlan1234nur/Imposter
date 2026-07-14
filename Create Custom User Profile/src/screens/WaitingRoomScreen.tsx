import { useState } from 'react'
import type { Game } from '../data/games'
import Button from '../components/Button'
import Badge from '../components/Badge'

interface WaitingRoomScreenProps {
  game: Game
  roomCode: string
  playerName: string
  isHost?: boolean
  onBack: () => void
  onStartGame: () => void
}

const MOCK_PLAYERS = [
  { id: '1', name: 'Болд', isHost: true, ready: true },
  { id: '2', name: 'Оюун', isHost: false, ready: true },
  { id: '3', name: 'Ганаа', isHost: false, ready: false },
  { id: '4', name: 'Мөнх', isHost: false, ready: true },
]

export default function WaitingRoomScreen({
  game,
  roomCode,
  playerName,
  isHost = true,
  onBack,
  onStartGame,
}: WaitingRoomScreenProps) {
  const [copied, setCopied] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [micOn, setMicOn] = useState(false)

  const players = [
    { id: 'me', name: playerName || 'Та', isHost, ready: true },
    ...MOCK_PLAYERS.filter((p) => p.name !== playerName),
  ]

  const handleCopy = () => {
    navigator.clipboard?.writeText(roomCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, color: '#7886A8' }}>Хүлээлгийн өрөө</p>
          <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#EEF2FF' }}>
            {game.title}
          </h1>
        </div>
        <Badge variant={game.mode === 'offline' ? 'offline' : 'online'} />
      </header>

      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Room code */}
        <div
          style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 16,
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#7886A8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Өрөөний код
          </p>
          <div
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: '#EEF2FF',
              letterSpacing: '0.3em',
              fontFamily: 'var(--font-mono)',
              marginBottom: 12,
            }}
          >
            {roomCode}
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={handleCopy}
              style={{
                ...actionBtn,
                background: copied ? 'rgba(52,211,153,0.12)' : 'rgba(124,58,237,0.12)',
                borderColor: copied ? 'rgba(52,211,153,0.3)' : 'rgba(124,58,237,0.3)',
                color: copied ? '#34D399' : '#A78BFA',
              }}
            >
              {copied ? '✓ Хуулагдлаа' : '⎘ Код хуулах'}
            </button>
            <button style={{ ...actionBtn }}>
              ↗ Хуваалцах
            </button>
          </div>
        </div>

        {/* Players */}
        <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={secLabel}>Тоглогчид</p>
            <span style={{ fontSize: 12, color: '#7886A8', fontFamily: 'var(--font-mono)' }}>
              {players.length} / {game.players.split('–')[1] || '?'}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {players.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: p.id === 'me' ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${p.id === 'me' ? 'rgba(124,58,237,0.2)' : 'transparent'}`,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${randomColor(p.id)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {p.name[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#EEF2FF' }}>
                    {p.name} {p.id === 'me' && <span style={{ fontSize: 11, color: '#7886A8' }}>(та)</span>}
                  </p>
                  {p.isHost && (
                    <p style={{ margin: 0, fontSize: 11, color: '#A78BFA' }}>⭐ Хост</p>
                  )}
                </div>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: p.ready ? '#34D399' : '#F59E0B',
                  }}
                />
              </div>
            ))}
          </div>
          {players.length < 4 && (
            <div
              style={{
                marginTop: 8,
                padding: '10px',
                borderRadius: 10,
                border: '1px dashed rgba(255,255,255,0.08)',
                textAlign: 'center',
                color: '#7886A8',
                fontSize: 13,
              }}
            >
              Найзаа урина уу...
            </div>
          )}
        </div>

        {/* Voice chat */}
        <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: '14px 16px' }}>
          <p style={{ ...secLabel, marginBottom: 10 }}>Дуут яриа</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <VoiceBtn active={voiceOn} onClick={() => setVoiceOn(!voiceOn)} label="Яриа" icon={voiceOn ? '🔊' : '🔇'} />
            <VoiceBtn active={micOn} onClick={() => setMicOn(!micOn)} label="Микрофон" icon={micOn ? '🎤' : '🚫'} />
          </div>
        </div>

        {/* Host settings */}
        {isHost && (
          <div style={{ background: '#0C1428', border: '1px solid rgba(167,139,250,0.08)', borderRadius: 16, padding: '14px 16px' }}>
            <p style={{ ...secLabel, marginBottom: 10 }}>Тоглоомын тохиргоо</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <SettingChip label="Тоглоом солих" />
              <SettingChip label="Нэмэлт дүрүүд" />
            </div>
          </div>
        )}
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
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {isHost ? (
          <Button variant="primary" size="lg" fullWidth onClick={onStartGame} disabled={players.length < 3}>
            ▶ Тоглоом эхлүүлэх
          </Button>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '14px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p style={{ margin: 0, fontSize: 14, color: '#7886A8' }}>Хост тоглоомыг эхлүүлэхийг хүлээж байна...</p>
          </div>
        )}
        <Button variant="danger" size="sm" fullWidth onClick={onBack}>
          Өрөөнөөс гарах
        </Button>
      </div>
    </div>
  )
}

function VoiceBtn({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '10px',
        borderRadius: 10,
        background: active ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.06)'}`,
        color: active ? '#A78BFA' : '#7886A8',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'all 0.15s',
        outline: 'none',
      }}
    >
      <span>{icon}</span> {label}
    </button>
  )
}

function SettingChip({ label }: { label: string }) {
  return (
    <button
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '7px 14px',
        color: '#C7D2FE',
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
      }}
    >
      {label}
    </button>
  )
}

function randomColor(seed: string): string {
  const colors: [string, string][] = [
    ['#7C3AED', '#6366F1'],
    ['#0D9488', '#0891B2'],
    ['#B45309', '#D97706'],
    ['#BE185D', '#9D174D'],
    ['#1D4ED8', '#7C3AED'],
  ]
  const i = seed.charCodeAt(0) % colors.length
  return `${colors[i][0]}, ${colors[i][1]}`
}

const secLabel: React.CSSProperties = {
  margin: 0,
  fontSize: 11,
  fontWeight: 700,
  color: '#7886A8',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

const actionBtn: React.CSSProperties = {
  background: 'rgba(124,58,237,0.12)',
  border: '1px solid rgba(124,58,237,0.3)',
  borderRadius: 10,
  padding: '8px 16px',
  color: '#A78BFA',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'all 0.15s',
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
