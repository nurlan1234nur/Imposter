import { useState } from 'react'
import type { AppCtx } from '../App'
import { games } from '../data/games'

interface Props { ctx: AppCtx }

const MOCK_PLAYERS = [
  { id: 1, name: 'Батбаяр', avatar: '🦊', ready: true, isHost: true, isYou: false },
  { id: 2, name: 'Оюунаа', avatar: '🌙', ready: true, isHost: false, isYou: true },
  { id: 3, name: 'Ганболд', avatar: '⚡', ready: false, isHost: false, isYou: false },
  { id: 4, name: 'Нарантуяа', avatar: '🔮', ready: false, isHost: false, isYou: false },
  { id: 5, name: 'Сэрдэнэ', avatar: '🐺', ready: true, isHost: false, isYou: false },
]

export default function WaitingRoomScreen({ ctx }: Props) {
  const game = games.find(g => g.id === ctx.selectedGameId) ?? games[0]
  const roomCode = ctx.roomCode ?? 'MF7X2K'
  const [players, setPlayers] = useState(MOCK_PLAYERS)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [starting, setStarting] = useState(false)

  const readyCount = players.filter(p => p.ready).length
  const isHost = players.find(p => p.isYou)?.isHost ?? false
  const canStart = players.length >= game.playersMin && readyCount >= Math.ceil(players.length * 0.6)

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const toggleReady = (id: number) => {
    setPlayers(ps => ps.map(p => p.id === id ? { ...p, ready: !p.ready } : p))
  }

  const removePlayer = (id: number) => {
    setPlayers(ps => ps.filter(p => p.id !== id))
  }

  const startGame = () => {
    setStarting(true)
    setTimeout(() => {
      setStarting(false)
      ctx.navigate('home') // placeholder: would go to in-game screen
    }, 2000)
  }

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', display: 'flex', flexDirection: 'column' }}>
      {/* Game header */}
      <div style={{
        background: `linear-gradient(165deg, ${game.gradientFrom} 0%, ${game.gradientTo} 70%, rgba(7,9,15,1) 100%)`,
        padding: '20px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 140, height: 140, borderRadius: '50%',
          background: `radial-gradient(circle, ${game.color}25 0%, transparent 70%)`,
          filter: 'blur(15px)',
        }} />
        <button
          onClick={ctx.back}
          style={{
            width: 38, height: 38, borderRadius: 11,
            background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'white', fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}
        >←</button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(0,0,0,0.4)',
            border: `2px solid ${game.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            {game.icon}
          </div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 20, color: 'white' }}>
              {game.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
              {game.players} тоглогч · {game.time}
            </div>
          </div>
        </div>

        {/* Room code + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            flex: 1, padding: '10px 14px',
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif", marginBottom: 2 }}>
                ӨРӨӨНИЙ КОД
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 22, color: 'white', letterSpacing: '0.14em' }}>
                {roomCode}
              </div>
            </div>
            <button
              onClick={copyCode}
              style={{
                padding: '7px 12px',
                background: copied ? 'rgba(16,185,129,0.25)' : 'rgba(124,58,237,0.3)',
                border: `1px solid ${copied ? 'rgba(16,185,129,0.4)' : 'rgba(124,58,237,0.4)'}`,
                borderRadius: 10, fontSize: 12, fontWeight: 600,
                color: copied ? '#6ee7b7' : '#c4b5fd',
                cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s',
              }}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          <button
            onClick={() => setShowQR(q => !q)}
            style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {showQR ? '✕' : '⬛'}
          </button>
          <button
            onClick={() => navigator.share?.({ text: `Нэгдэх: онлайн-өрөө.mn/join/${roomCode}` }).catch(() => {})}
            style={{
              width: 46, height: 46, borderRadius: 12,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 20, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            📤
          </button>
        </div>

        {/* QR expand panel */}
        {showQR && (
          <div className="fade-up" style={{
            marginTop: 12,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16, padding: 16,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 120, height: 120, background: 'white', borderRadius: 12, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 104, height: 104, background: '#1a1a2e', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                {game.icon}
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
              QR уншуулж нэгдэнэ
            </div>
          </div>
        )}
      </div>

      {/* Player list area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px' }}>
        {/* Min players indicator */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
              Тоглогчид
            </span>
            <span style={{ fontSize: 12, fontFamily: "'Inter', sans-serif", color: players.length >= game.playersMin ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
              {players.length}/{game.playersMax} · Хамгийн бага {game.playersMin}
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, background: '#131829', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((players.length / game.playersMax) * 100, 100)}%`,
              background: players.length >= game.playersMin
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              borderRadius: 4, transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ fontSize: 10, color: '#475569', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
            {players.length < game.playersMin
              ? `${game.playersMin - players.length} тоглогч дутуу байна`
              : 'Тоглоом эхлүүлэх боломжтой'}
          </div>
        </div>

        {/* Players */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          {players.map(player => (
            <div
              key={player.id}
              style={{
                background: player.isYou ? 'rgba(124,58,237,0.12)' : '#131829',
                border: player.isYou ? '1px solid rgba(124,58,237,0.3)' : '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all 0.2s',
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 13, flexShrink: 0,
                background: `linear-gradient(135deg, ${game.gradientFrom}80, ${game.gradientTo}60)`,
                border: `1.5px solid ${player.ready ? '#10b981' : 'rgba(255,255,255,0.1)'}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: player.ready ? '0 0 8px rgba(16,185,129,0.2)' : 'none',
              }}>
                {player.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
                    {player.name}
                  </span>
                  {player.isHost && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                      color: '#f59e0b', background: 'rgba(245,158,11,0.15)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      padding: '1px 6px', borderRadius: 8,
                    }}>👑 ХОСТ</span>
                  )}
                  {player.isYou && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, fontFamily: "'Inter', sans-serif",
                      color: '#a78bfa', background: 'rgba(124,58,237,0.15)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      padding: '1px 6px', borderRadius: 8,
                    }}>Та</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: player.ready ? '#10b981' : '#f59e0b', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                  {player.ready ? '✓ Бэлэн' : '⏳ Хүлээж байна'}
                </div>
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 6 }}>
                {player.isYou && (
                  <button
                    onClick={() => toggleReady(player.id)}
                    style={{
                      padding: '7px 12px',
                      background: player.ready ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                      border: `1px solid ${player.ready ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
                      borderRadius: 10, fontSize: 11, fontWeight: 600,
                      color: player.ready ? '#6ee7b7' : '#c4b5fd',
                      cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {player.ready ? '✓ Бэлэн' : 'Бэлэн'}
                  </button>
                )}
                {isHost && !player.isHost && !player.isYou && (
                  <button
                    onClick={() => removePlayer(player.id)}
                    style={{
                      width: 32, height: 32, borderRadius: 9,
                      background: 'rgba(239,68,68,0.1)',
                      border: '1px solid rgba(239,68,68,0.2)',
                      color: '#fca5a5', fontSize: 14, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                )}
              </div>
            </div>
          ))}

          {/* Empty slot */}
          {players.length < game.playersMax && (
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1.5px dashed rgba(255,255,255,0.1)',
              borderRadius: 16, padding: '16px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 13,
                border: '2px dashed rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, color: '#475569',
              }}>+</div>
              <div style={{ fontSize: 13, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                Найзаа урьж нэгдүүлэ...
              </div>
            </div>
          )}
        </div>

        {/* Invite actions */}
        <div style={{ marginBottom: 100 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 12 }}>
            Найзуудаа урих
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { icon: '📋', label: 'Код хуулах', action: copyCode },
              { icon: '🔗', label: 'Холбоос', action: () => navigator.clipboard.writeText(`онлайн-өрөө.mn/join/${roomCode}`).catch(() => {}) },
              { icon: '📤', label: 'Хуваалцах', action: () => navigator.share?.({ text: roomCode }).catch(() => {}) },
              { icon: '⬛', label: 'QR код', action: () => setShowQR(q => !q) },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="press-sm"
                style={{
                  padding: '14px 10px',
                  background: '#131829',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 22 }}>{btn.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
                  {btn.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Start game button */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 20px max(env(safe-area-inset-bottom),16px)',
        background: 'rgba(7,9,15,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {isHost ? (
          <button
            onClick={startGame}
            disabled={!canStart || starting}
            className="press"
            style={{
              width: '100%', height: 56,
              background: canStart ? `linear-gradient(135deg, ${game.color}cc, ${game.color})` : '#131829',
              border: canStart ? 'none' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              color: canStart ? 'white' : '#475569',
              fontSize: 16, fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: canStart ? 'pointer' : 'not-allowed',
              boxShadow: canStart ? `0 0 28px ${game.color}50` : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.3s',
            }}
          >
            {starting ? (
              <>
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Эхлүүлж байна...
              </>
            ) : (
              canStart ? '🎮 Тоглоом эхлүүлэх' : `⏳ ${game.playersMin - players.length > 0 ? `${game.playersMin - players.length} тоглогч дутуу` : 'Бэлэн хүлээж байна'}`
            )}
          </button>
        ) : (
          <div style={{
            width: '100%', height: 54,
            background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 14, color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>
              Хост тоглоомыг эхлүүлэхийг хүлээж байна...
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:0.4;} 50%{opacity:1;} }
      `}</style>
    </div>
  )
}
