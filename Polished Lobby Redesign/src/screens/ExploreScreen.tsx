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

const FILTERS = ['Бүгд', 'Хялбар', 'Дунд', 'Хэцүү', '4–6 тоглогч', '6+ тоглогч']

export default function ExploreScreen({ ctx }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('Бүгд')

  const filtered = games.filter(g => {
    const q = query.toLowerCase()
    const matchQuery = !q || g.name.toLowerCase().includes(q) || g.nameEn.toLowerCase().includes(q)
    const matchFilter =
      filter === 'Бүгд' ? true :
      filter === 'Хялбар' ? g.difficulty === 'Хялбар' :
      filter === 'Дунд' ? g.difficulty === 'Дунд' :
      filter === 'Хэцүү' ? g.difficulty === 'Хэцүү' :
      filter === '4–6 тоглогч' ? g.playersMin <= 6 :
      filter === '6+ тоглогч' ? g.playersMax > 6 : true
    return matchQuery && matchFilter
  })

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        background: 'rgba(7,9,15,0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 40,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#f1f5f9', marginBottom: 12 }}>
          🕹️ Тоглоомууд
        </h1>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 16, opacity: 0.5,
          }}>🔍</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Тоглоом хайх..."
            style={{
              width: '100%', height: 44,
              background: '#131829',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              paddingLeft: 40, paddingRight: 14,
              color: '#f1f5f9', fontSize: 14,
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 20px 2px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              flexShrink: 0,
              padding: '7px 14px',
              borderRadius: 20,
              fontSize: 12, fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: filter === f ? '#7c3aed' : 'rgba(255,255,255,0.06)',
              border: filter === f ? '1px solid #7c3aed' : '1px solid rgba(255,255,255,0.1)',
              color: filter === f ? 'white' : '#94a3b8',
              boxShadow: filter === f ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding: '10px 20px 14px' }}>
        <span style={{ fontSize: 12, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
          {filtered.length} тоглоом олдлоо
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 20px' }}>
        {filtered.map((game) => (
          <button
            key={game.id}
            onClick={() => ctx.navigate('game-detail', { gameId: game.id })}
            className="press"
            style={{
              background: `linear-gradient(160deg, ${game.gradientFrom} 0%, ${game.gradientTo} 100%)`,
              border: `1px solid ${game.color}20`,
              borderRadius: 20,
              padding: 0, overflow: 'hidden',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: `0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px ${game.color}12`,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Top */}
            <div style={{ padding: '16px 14px 10px', flex: 1 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 10,
                border: `1px solid ${game.color}28`,
              }}>
                {game.icon}
              </div>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontWeight: 800,
                fontSize: 15, color: 'white', lineHeight: 1.2, marginBottom: 4,
              }}>
                {game.name}
              </div>
              <div style={{
                fontSize: 10.5, color: 'rgba(255,255,255,0.6)',
                fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
              }}>
                {game.description}
              </div>
            </div>
            {/* Bottom */}
            <div style={{
              padding: '8px 14px 12px',
              background: 'rgba(0,0,0,0.25)',
              borderTop: `1px solid ${game.color}18`,
              display: 'flex', flexWrap: 'wrap', gap: 5,
            }}>
              <span style={{
                fontSize: 10, color: 'rgba(255,255,255,0.55)',
                fontFamily: "'Inter', sans-serif",
                background: 'rgba(0,0,0,0.25)',
                padding: '2px 7px', borderRadius: 10,
              }}>
                👥 {game.players}
              </span>
              <span style={{
                fontSize: 10, color: 'rgba(255,255,255,0.55)',
                fontFamily: "'Inter', sans-serif",
                background: 'rgba(0,0,0,0.25)',
                padding: '2px 7px', borderRadius: 10,
              }}>
                ⏱ {game.time}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 600,
                color: DIFFICULTY_COLOR[game.difficulty],
                fontFamily: "'Inter', sans-serif",
                background: `${DIFFICULTY_COLOR[game.difficulty]}15`,
                padding: '2px 7px', borderRadius: 10,
                border: `1px solid ${DIFFICULTY_COLOR[game.difficulty]}28`,
              }}>
                {game.difficulty}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎲</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: '#94a3b8' }}>
            Тоглоом олдсонгүй
          </div>
        </div>
      )}

      <BottomNav ctx={ctx} />
    </div>
  )
}
