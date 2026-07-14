import type { Game } from '../data/games'
import Badge from '../components/Badge'
import Button from '../components/Button'
import StarField from '../components/StarField'

interface GameDetailScreenProps {
  game: Game
  playerName: string
  onBack: () => void
  onCreateRoom: (game: Game) => void
  onOfflineSetup: (game: Game) => void
}

export default function GameDetailScreen({
  game,
  playerName,
  onBack,
  onCreateRoom,
  onOfflineSetup,
}: GameDetailScreenProps) {
  const isOfflineOnly = game.mode === 'offline'
  const isOfflineImposter = game.id === 'imposter-offline'

  const howToPlay: Record<string, string[]> = {
    'imposter-online': [
      'Тоглогч бүр өрөөнд нэгдэж утсаараа тоглоно',
      'Нэг тоглогч импостер болж, бусад нь байцаагч',
      'Импостер бусдын ярилцлагаас нуугдан яриаг буруутгана',
      'Хэн импостер болохыг олвол иргэд хожно',
    ],
    'imposter-offline': [
      'Нэг утсыг дараалан хүн бүрт дамжуулна',
      'Утсан дээр дүрийг харуулах бөгөөд импостер өөр үг харна',
      'Бүгд дүрийнхээ талаар ярилцана',
      'Санал хураалт хийж импостерийг олно',
    ],
    mafia: [
      'Шөнийн үед мафиа хохирогч сонгоно',
      'Эмч аминд орохыг хамгаалж болно',
      'Мөрдөгч нэг мафиаг судалж болно',
      'Өдрийн хэлэлцүүлгээр санал хураалт хийнэ',
      'Мафиа нь амьд тоглогчидтой тэнцвэртэй болоход хожно',
    ],
    default: [
      'Тоглоомын дүрмийг уншина уу',
      'Хуваарилагдсан дүрийнхээ дагуу тоглоно',
      'Хамгийн сайн стратегиар хожно',
    ],
  }

  const steps = howToPlay[game.id] || howToPlay.default

  return (
    <div style={{ minHeight: '100vh', background: '#060A18', display: 'flex', flexDirection: 'column' }}>
      {/* Hero */}
      <div
        style={{
          background: game.bg,
          padding: '0 0 24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <StarField count={25} />

        {/* Back */}
        <div style={{ position: 'relative', zIndex: 2, padding: '16px 20px' }}>
          <button onClick={onBack} style={backBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Буцах
          </button>
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '8px 24px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 52, lineHeight: 1 }}>{game.icon}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#EEF2FF', margin: 0, letterSpacing: '-0.02em' }}>
              {game.title}
            </h1>
            {game.mode !== 'both' && <Badge variant={game.mode} />}
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Meta icon="👥" label={game.players + ' тоглогч'} />
            <Meta icon="⏱" label={game.duration} />
            <Meta icon="🎯" label={game.difficulty} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Description */}
        <Card>
          <h3 style={secLabel}>Тоглоомын тухай</h3>
          <p style={{ fontSize: 14, color: '#C7D2FE', lineHeight: 1.65, margin: 0 }}>
            {game.description}
          </p>
        </Card>

        {/* How to play */}
        <Card>
          <h3 style={secLabel}>Хэрхэн тоглох вэ</h3>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 6,
                    background: 'rgba(124,58,237,0.15)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    color: '#A78BFA',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 14, color: '#C7D2FE', lineHeight: 1.55 }}>{step}</span>
              </li>
            ))}
          </ol>
        </Card>

        {/* Player name summary */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
            padding: '12px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg,#7C3AED,#6366F1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {playerName[0]?.toUpperCase() || 'Т'}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#EEF2FF' }}>{playerName || 'Тоглогч'}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#7886A8' }}>Таны нэр</p>
            </div>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#818CF8', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Өөрчлөх
          </button>
        </div>
      </div>

      {/* Sticky CTA */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 480,
          background: 'rgba(6,10,24,0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(167,139,250,0.1)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {isOfflineImposter ? (
          <Button variant="primary" size="lg" fullWidth onClick={() => onOfflineSetup(game)}>
            🎮 Офлайн тоглоом эхлүүлэх
          </Button>
        ) : (
          <>
            <Button variant="primary" size="lg" fullWidth onClick={() => onCreateRoom(game)}>
              + Өрөө үүсгэх
            </Button>
            {!isOfflineOnly && (
              <Button variant="ghost" size="md" fullWidth onClick={() => onOfflineSetup(game)}>
                Офлайн тоглох
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function Meta({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#0C1428',
        border: '1px solid rgba(167,139,250,0.08)',
        borderRadius: 16,
        padding: '16px',
      }}
    >
      {children}
    </div>
  )
}

const secLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#7886A8',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  margin: '0 0 12px',
}

const backBtn: React.CSSProperties = {
  background: 'rgba(0,0,0,0.3)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10,
  padding: '8px 14px',
  color: '#EEF2FF',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'var(--font-sans)',
  outline: 'none',
}
