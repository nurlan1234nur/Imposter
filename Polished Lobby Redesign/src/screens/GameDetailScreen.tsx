import type { AppCtx } from '../App'
import { games } from '../data/games'

interface Props { ctx: AppCtx }

const DIFFICULTY_COLOR: Record<string, string> = {
  'Хялбар': '#10b981',
  'Дунд': '#f59e0b',
  'Хэцүү': '#ef4444',
}

const TEAM_COLOR: Record<string, string> = {
  good: '#10b981',
  evil: '#ef4444',
  neutral: '#f59e0b',
}
const TEAM_LABEL: Record<string, string> = {
  good: 'Сайн тал',
  evil: 'Муу тал',
  neutral: 'Тэнийсэн',
}

export default function GameDetailScreen({ ctx }: Props) {
  const game = games.find(g => g.id === ctx.selectedGameId) ?? games[0]

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 100 }}>
      {/* Hero header */}
      <div style={{
        position: 'relative', height: 220,
        background: `linear-gradient(165deg, ${game.gradientFrom} 0%, ${game.gradientTo} 60%, rgba(7,9,15,1) 100%)`,
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: `radial-gradient(circle, ${game.color}30 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }} />
        {/* Back button */}
        <button
          onClick={ctx.back}
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'white', fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>
        {/* Icon + title */}
        <div style={{
          position: 'absolute', bottom: 28, left: 24,
          display: 'flex', alignItems: 'flex-end', gap: 16,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            border: `2px solid ${game.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36,
            boxShadow: `0 0 20px ${game.color}30`,
          }}>
            {game.icon}
          </div>
          <div>
            <h1 style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 900,
              fontSize: 28, color: 'white', lineHeight: 1.1, margin: 0,
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            }}>
              {game.name}
            </h1>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
              {game.nameEn}
            </div>
          </div>
        </div>
      </div>

      {/* Stat pills */}
      <div style={{ padding: '0 20px', marginTop: -16, position: 'relative', zIndex: 2, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { icon: '👥', label: game.players + ' тоглогч' },
          { icon: '⏱', label: game.time },
          { icon: '📊', label: game.difficulty, color: DIFFICULTY_COLOR[game.difficulty] },
        ].map(pill => (
          <div key={pill.label} style={{
            background: '#131829',
            border: `1px solid ${pill.color ? pill.color + '30' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 20, padding: '7px 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span style={{ fontSize: 13 }}>{pill.icon}</span>
            <span style={{
              fontSize: 12, fontWeight: 600,
              color: pill.color ?? '#94a3b8',
              fontFamily: "'Inter', sans-serif",
            }}>{pill.label}</span>
          </div>
        ))}
      </div>

      {/* Tags */}
      <div style={{ padding: '14px 20px 0', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {game.tags.map(tag => (
          <span key={tag} style={{
            fontSize: 11, fontWeight: 500,
            color: '#a78bfa', fontFamily: "'Inter', sans-serif",
            background: 'rgba(124,58,237,0.12)',
            border: '1px solid rgba(124,58,237,0.2)',
            padding: '3px 10px', borderRadius: 20,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Description */}
      <div style={{ padding: '18px 20px 0' }}>
        <p style={{
          fontSize: 14, color: '#94a3b8', lineHeight: 1.65,
          fontFamily: "'Inter', sans-serif",
          background: '#131829',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, padding: '16px 18px',
          margin: 0,
        }}>
          {game.longDescription}
        </p>
      </div>

      {/* Roles */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: '#f1f5f9', marginBottom: 12 }}>
          Дүрүүд
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {game.roles.map(role => (
            <div key={role.name} style={{
              background: '#131829',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                background: `${TEAM_COLOR[role.team]}15`,
                border: `1px solid ${TEAM_COLOR[role.team]}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {role.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
                    {role.name}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                    color: TEAM_COLOR[role.team],
                    background: `${TEAM_COLOR[role.team]}15`,
                    padding: '1px 7px', borderRadius: 10,
                  }}>
                    {TEAM_LABEL[role.team]}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
                  {role.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to play preview */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: '#f1f5f9', marginBottom: 12 }}>
          Тоглох заавар
        </h2>
        <div style={{
          background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 16, overflow: 'hidden',
        }}>
          {game.howToPlay.map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 14, padding: '14px 16px',
              borderBottom: i < game.howToPlay.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              alignItems: 'flex-start',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${game.color}50, ${game.color}25)`,
                border: `1px solid ${game.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                color: 'white', fontFamily: "'Outfit', sans-serif",
              }}>
                {i + 1}
              </div>
              <p style={{
                margin: 0, fontSize: 13, color: '#94a3b8',
                fontFamily: "'Inter', sans-serif", lineHeight: 1.55,
              }}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA buttons - sticky */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        padding: '12px 20px max(env(safe-area-inset-bottom),16px)',
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', gap: 12, zIndex: 50,
      }}>
        <button
          onClick={() => ctx.navigate('how-to-play')}
          style={{
            flex: 1, height: 50,
            background: '#131829',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14,
            color: '#94a3b8', fontSize: 14, fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            cursor: 'pointer',
          }}
        >
          📖 Заавар
        </button>
        <button
          onClick={() => ctx.navigate('create-room', { gameId: game.id })}
          className="press"
          style={{
            flex: 2, height: 50,
            background: `linear-gradient(135deg, #7c3aed, #9333ea)`,
            border: 'none', borderRadius: 14,
            color: 'white', fontSize: 14, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(124,58,237,0.4)',
          }}
        >
          🏠 Өрөө үүсгэх
        </button>
      </div>
    </div>
  )
}
