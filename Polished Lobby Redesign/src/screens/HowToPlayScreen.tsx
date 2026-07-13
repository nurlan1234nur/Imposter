import { useState } from 'react'
import type { AppCtx } from '../App'
import { games } from '../data/games'
import BottomNav from '../components/BottomNav'

interface Props { ctx: AppCtx }

const DIFFICULTY_COLOR: Record<string, string> = {
  'Хялбар': '#10b981',
  'Дунд': '#f59e0b',
  'Хэцүү': '#ef4444',
}

export default function HowToPlayScreen({ ctx }: Props) {
  const [selectedId, setSelectedId] = useState(ctx.selectedGameId ?? 'mafia')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const game = games.find(g => g.id === selectedId) ?? games[0]

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#f1f5f9', marginBottom: 14 }}>
          📖 Тоглох заавар
        </h1>
        {/* Game selector tabs */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {games.map(g => (
            <button
              key={g.id}
              onClick={() => { setSelectedId(g.id); setExpandedStep(null) }}
              style={{
                flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 12px',
                background: selectedId === g.id
                  ? `linear-gradient(135deg, ${g.gradientFrom}cc, ${g.gradientTo}cc)`
                  : '#131829',
                border: selectedId === g.id ? `1px solid ${g.color}40` : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                cursor: 'pointer',
                boxShadow: selectedId === g.id ? `0 0 10px ${g.color}25` : 'none',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 14 }}>{g.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: selectedId === g.id ? 'white' : '#64748b', fontFamily: "'Inter', sans-serif" }}>
                {g.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Game hero */}
      <div style={{
        height: 140,
        background: `linear-gradient(160deg, ${game.gradientFrom} 0%, ${game.gradientTo} 70%, transparent 100%)`,
        padding: '20px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -10,
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${game.color}20 0%, transparent 70%)`,
          filter: 'blur(12px)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(0,0,0,0.35)',
            border: `2px solid ${game.color}35`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28,
          }}>
            {game.icon}
          </div>
          <div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 22, color: 'white', margin: 0, marginBottom: 4 }}>
              {game.name}
            </h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                👥 {game.players}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: DIFFICULTY_COLOR[game.difficulty], fontFamily: "'Inter', sans-serif" }}>
                {game.difficulty}
              </span>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: '12px 0 0', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
          {game.description}
        </p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Step by step */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: '#f1f5f9', marginBottom: 14 }}>
            Тоглоомын явц
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {game.howToPlay.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 0 }}>
                {/* Timeline line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${game.color}80, ${game.color}40)`,
                    border: `1.5px solid ${game.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800, color: 'white',
                    fontFamily: "'Outfit', sans-serif",
                    zIndex: 1,
                  }}>
                    {i + 1}
                  </div>
                  {i < game.howToPlay.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 20, background: `linear-gradient(180deg, ${game.color}30, transparent)`, margin: '4px 0' }} />
                  )}
                </div>
                {/* Content */}
                <div
                  onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                  style={{
                    flex: 1, marginLeft: 14, marginBottom: i < game.howToPlay.length - 1 ? 16 : 0,
                    background: expandedStep === i ? 'rgba(124,58,237,0.1)' : '#131829',
                    border: expandedStep === i ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 14, padding: '12px 14px',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <p style={{ margin: 0, fontSize: 13.5, color: '#cbd5e1', fontFamily: "'Inter', sans-serif", lineHeight: 1.55 }}>
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Roles */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: '#f1f5f9', marginBottom: 14 }}>
            Дүрүүд ба багууд
          </h3>
          {['good', 'evil', 'neutral'].map(team => {
            const teamRoles = game.roles.filter(r => r.team === team)
            if (!teamRoles.length) return null
            const teamColor = team === 'good' ? '#10b981' : team === 'evil' ? '#ef4444' : '#f59e0b'
            const teamLabel = team === 'good' ? '🛡️ Сайн тал' : team === 'evil' ? '⚔️ Муу тал' : '🌀 Тэнийсэн'
            return (
              <div key={team} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: teamColor, fontFamily: "'Inter', sans-serif", letterSpacing: '0.08em', marginBottom: 8 }}>
                  {teamLabel}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {teamRoles.map(role => (
                    <div key={role.name} style={{
                      background: '#131829', border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 14, padding: '12px 14px',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                        background: `${teamColor}12`, border: `1px solid ${teamColor}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      }}>
                        {role.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 3 }}>
                          {role.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
                          {role.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Tips */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(124,58,237,0.05))',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 18, padding: '18px 18px', marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 15, color: '#c4b5fd', marginBottom: 12 }}>
            💡 Зөвлөгөө
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Нүүрний хувирлыг анхаарч үз — худал хэлдэг хүн байнга ижил дохиог давтдаг.',
              'Хэт их мэдрэмтгий эсэргүүцдэг хүн заримдаа нуугдаж байдаг.',
              'Санал өгөхөөсөө өмнө бусдын дохиог ажиглаарай.',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>✦</span>
                <span style={{ fontSize: 12.5, color: '#94a3b8', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => ctx.navigate('create-room', { gameId: game.id })}
          className="press"
          style={{
            width: '100%', height: 54,
            background: `linear-gradient(135deg, ${game.color}cc, ${game.color})`,
            border: 'none', borderRadius: 16,
            color: 'white', fontSize: 15, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
            boxShadow: `0 0 24px ${game.color}40`,
            marginBottom: 4,
          }}
        >
          🏠 {game.name} тоглоорой
        </button>
      </div>

      <BottomNav ctx={ctx} />
    </div>
  )
}
