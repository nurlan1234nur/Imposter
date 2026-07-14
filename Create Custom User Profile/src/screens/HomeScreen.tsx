import { useState } from 'react'
import { GAMES, type Category, type Game } from '../data/games'
import Logo from '../components/Logo'
import Badge from '../components/Badge'
import StarField from '../components/StarField'

interface HomeScreenProps {
  playerName: string
  onGameSelect: (game: Game) => void
  onOpenSettings: () => void
  onJoin: () => void
}

const CATS: { id: Category; label: string }[] = [
  { id: 'all', label: 'Бүгд' },
  { id: 'online', label: 'Онлайн' },
  { id: 'offline', label: 'Офлайн' },
  { id: 'party', label: 'Пати' },
  { id: 'strategy', label: 'Стратеги' },
]

export default function HomeScreen({ playerName, onGameSelect, onOpenSettings, onJoin }: HomeScreenProps) {
  const [category, setCategory] = useState<Category>('all')
  const [roomCode, setRoomCode] = useState('')

  const filtered = category === 'all'
    ? GAMES
    : GAMES.filter((g) => g.category === category || (category === 'online' && g.mode === 'online') || (category === 'offline' && g.mode === 'offline'))

  const featured = GAMES.slice(0, 3)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#060A18',
        paddingBottom: 80,
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'fixed',
          top: -80,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(6,10,24,0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(167,139,250,0.08)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Logo size={28} />
          <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.02em', color: '#EEF2FF' }}>
            Сэжиг
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(167,139,250,0.1)',
              border: '1px solid rgba(167,139,250,0.15)',
              borderRadius: 20,
              padding: '5px 12px 5px 8px',
              cursor: 'pointer',
            }}
            onClick={onOpenSettings}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#7C3AED,#6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {playerName[0]?.toUpperCase() || 'Т'}
            </div>
            <span style={{ fontSize: 13, color: '#C7D2FE', fontWeight: 600 }}>
              {playerName || 'Тоглогч'}
            </span>
          </div>
          <button
            onClick={onOpenSettings}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: '#7886A8',
              display: 'flex',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <div
          style={{
            margin: '16px 20px 0',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #1a0b3e 0%, #0d1530 100%)',
            border: '1px solid rgba(167,139,250,0.12)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <StarField count={30} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 12, color: '#7886A8', marginBottom: 4 }}>Сайн уу 👋</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#EEF2FF', marginBottom: 2, letterSpacing: '-0.02em' }}>
              Тоглоом эхлүүлэх үү?
            </h2>
            <p style={{ fontSize: 13, color: '#7886A8', marginBottom: 16 }}>
              Кодоор нэгдэх эсвэл шинэ өрөө үүсгэ
            </p>

            {/* Quick join */}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="КОДОО ОРУ"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(167,139,250,0.2)',
                  borderRadius: 12,
                  padding: '12px 14px',
                  color: '#EEF2FF',
                  fontSize: 15,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.15em',
                  fontWeight: 600,
                  outline: 'none',
                }}
                maxLength={6}
              />
              <button
                onClick={onJoin}
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #6366F1)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 18px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                }}
              >
                Нэгдэх
              </button>
            </div>
          </div>
        </div>

        {/* Featured */}
        <div style={{ padding: '20px 20px 0' }}>
          <SectionHeader title="Онцлох тоглоом" />
        </div>
        <div style={{ display: 'flex', gap: 12, padding: '10px 20px', overflowX: 'auto' }}>
          {featured.map((game) => (
            <FeaturedCard key={game.id} game={game} onClick={() => onGameSelect(game)} />
          ))}
        </div>

        {/* Catalog */}
        <div style={{ padding: '16px 20px 0' }}>
          <SectionHeader title="Бүх тоглоом" />

          {/* Filters */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 0' }}>
            {CATS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  background: category === cat.id ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${category === cat.id ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 20,
                  padding: '7px 16px',
                  color: category === cat.id ? '#A78BFA' : '#7886A8',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 4,
            }}
          >
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} onClick={() => onGameSelect(game)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#EEF2FF', margin: 0 }}>{title}</h3>
  )
}

function FeaturedCard({ game, onClick }: { game: Game; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 200,
        borderRadius: 16,
        background: game.bg,
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '16px',
        cursor: 'pointer',
        textAlign: 'left',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{game.icon}</div>
      <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF2FF', margin: '0 0 4px' }}>
        {game.title}
      </p>
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.4 }}>
        {game.players} тоглогч · {game.duration}
      </p>
      <div style={{ position: 'absolute', top: 12, right: 12 }}>
        {game.mode !== 'both' && <Badge variant={game.mode} small />}
      </div>
    </button>
  )
}

function GameCard({ game, onClick }: { game: Game; onClick: () => void }) {
  const diffDots = [1, 2, 3].map((d) => (
    <div
      key={d}
      style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: d <= game.difficultyNum ? game.color : 'rgba(255,255,255,0.1)',
      }}
    />
  ))

  return (
    <button
      onClick={onClick}
      style={{
        background: '#0C1428',
        border: '1px solid rgba(167,139,250,0.08)',
        borderRadius: 16,
        padding: '14px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.15s, transform 0.1s',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${game.color}40`
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(167,139,250,0.08)'
        e.currentTarget.style.transform = ''
      }}
    >
      {/* Color accent bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${game.color}80, transparent)`,
          borderRadius: '16px 16px 0 0',
        }}
      />

      <div style={{ fontSize: 26, marginBottom: 8, marginTop: 4 }}>{game.icon}</div>

      <p style={{ fontSize: 13, fontWeight: 700, color: '#EEF2FF', margin: '0 0 3px', lineHeight: 1.3 }}>
        {game.title}
      </p>
      <p style={{ fontSize: 11, color: '#7886A8', margin: '0 0 8px', lineHeight: 1.4 }}>
        {game.players} · {game.duration}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 3 }}>{diffDots}</div>
        {game.mode !== 'both' && <Badge variant={game.mode} small />}
      </div>
    </button>
  )
}
