import { useState } from 'react'
import type { AppCtx } from '../App'
import { games, recentRooms } from '../data/games'
import BottomNav from '../components/BottomNav'

// Fixed star positions for the night sky
const STARS = [
  {x:4,y:6,s:1.5,o:0.85},{x:11,y:3,s:1,o:0.6},{x:19,y:11,s:2,o:0.9},
  {x:27,y:5,s:1,o:0.5},{x:34,y:14,s:1.5,o:0.75},{x:41,y:2,s:1,o:0.8},
  {x:47,y:9,s:2,o:0.65},{x:54,y:6,s:1,o:0.9},{x:61,y:13,s:1.5,o:0.7},
  {x:69,y:4,s:1,o:0.55},{x:74,y:10,s:2,o:0.8},{x:81,y:3,s:1,o:0.65},
  {x:87,y:8,s:1.5,o:0.9},{x:91,y:15,s:1,o:0.7},{x:96,y:5,s:1,o:0.5},
  {x:7,y:21,s:1,o:0.6},{x:14,y:26,s:1.5,o:0.75},{x:22,y:18,s:1,o:0.5},
  {x:29,y:23,s:2,o:0.7},{x:37,y:19,s:1,o:0.8},{x:44,y:27,s:1.5,o:0.6},
  {x:51,y:21,s:1,o:0.9},{x:57,y:29,s:1,o:0.5},{x:64,y:22,s:1.5,o:0.7},
  {x:71,y:17,s:2,o:0.8},{x:77,y:25,s:1,o:0.6},{x:84,y:20,s:1.5,o:0.85},
  {x:89,y:24,s:1,o:0.5},{x:94,y:19,s:1,o:0.7},{x:2,y:31,s:1.5,o:0.8},
  {x:17,y:33,s:1,o:0.6},{x:31,y:36,s:2,o:0.65},{x:46,y:31,s:1,o:0.8},
  {x:59,y:34,s:1.5,o:0.55},{x:72,y:28,s:1,o:0.9},{x:85,y:36,s:1,o:0.6},
  {x:9,y:39,s:1.5,o:0.7},{x:24,y:41,s:1,o:0.5},{x:50,y:38,s:1.5,o:0.75},
  {x:67,y:43,s:2,o:0.6},{x:78,y:40,s:1,o:0.8},{x:92,y:38,s:1.5,o:0.55},
]

// Window positions on the city silhouette
const WINDOWS = [
  {x:64,y:48,w:3,h:2},{x:69,y:48,w:3,h:2},{x:64,y:52,w:3,h:2},
  {x:113,y:54,w:3,h:2},{x:118,y:50,w:3,h:2},{x:118,y:54,w:3,h:2},
  {x:163,y:57,w:3,h:2},{x:163,y:62,w:3,h:2},{x:168,y:60,w:3,h:2},
  {x:233,y:55,w:3,h:2},{x:238,y:53,w:3,h:2},{x:233,y:60,w:3,h:2},
  {x:281,y:51,w:3,h:2},{x:286,y:55,w:3,h:2},{x:281,y:58,w:3,h:2},
  {x:331,y:48,w:3,h:2},{x:336,y:53,w:3,h:2},{x:362,y:53,w:3,h:2},
  {x:367,y:57,w:3,h:2},{x:23,y:68,w:3,h:2},{x:28,y:72,w:3,h:2},
  {x:108,y:65,w:3,h:2},{x:113,y:68,w:3,h:2},{x:225,y:62,w:3,h:2},
  {x:295,y:68,w:3,h:2},{x:350,y:65,w:3,h:2},{x:355,y:68,w:3,h:2},
]

interface Props { ctx: AppCtx }

const FEATURED = games.filter(g => g.featured)
const DIFFICULTY_COLOR: Record<string, string> = {
  'Хялбар': '#10b981',
  'Дунд': '#f59e0b',
  'Хэцүү': '#ef4444',
}

export default function HomeScreen({ ctx }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 80 }}>
      {/* ── TOP BAR ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px 12px',
        background: 'rgba(7,9,15,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28,
            background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>🌙</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800, fontSize: 17,
            background: 'linear-gradient(90deg, #f1f5f9, #c4b5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Онлайн өрөө</span>
        </div>
        <button
          onClick={() => ctx.setLanguage(ctx.language === 'mn' ? 'en' : 'mn')}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20,
            padding: '5px 12px',
            color: '#94a3b8', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', letterSpacing: '0.08em',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {ctx.language === 'mn' ? 'MN' : 'EN'} ↕
        </button>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: 320, overflow: 'hidden' }}>
        {/* Sky gradient */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, #050710 0%, #0a0b1a 35%, #0d0e1f 65%, #0d1117 100%)',
        }} />

        {/* Purple atmospheric glow */}
        <div style={{
          position: 'absolute', top: '5%', left: '20%',
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 50%, transparent 70%)',
          filter: 'blur(20px)',
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '10%',
          width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)',
          filter: 'blur(12px)',
        }} />

        {/* Stars */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 50" preserveAspectRatio="none">
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.s * 0.18} fill="white" opacity={s.o} />
          ))}
        </svg>

        {/* Moon crescent */}
        <svg style={{ position: 'absolute', top: 20, right: 24 }} width="52" height="52" viewBox="0 0 52 52">
          <defs>
            <radialGradient id="moonGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="26" cy="26" r="26" fill="url(#moonGlow)" />
          <path
            d="M33 26 a10 10 0 1 1-10-10 A7 7 0 0 0 33 26z"
            fill="#c4b5fd" opacity="0.85"
          />
          <path
            d="M33 26 a10 10 0 1 1-10-10 A7 7 0 0 0 33 26z"
            fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"
          />
        </svg>

        {/* City skyline SVG */}
        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
          viewBox="0 0 390 120" preserveAspectRatio="none"
          height="120"
        >
          <defs>
            <linearGradient id="cityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1117" />
              <stop offset="100%" stopColor="#07090f" />
            </linearGradient>
            <linearGradient id="cityGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(124,58,237,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {/* Glow layer */}
          <path
            d="M0,120 L0,88 L18,88 L18,68 L26,68 L26,60 L31,60 L31,54 L36,54 L36,60 L41,60 L41,68
            L58,68 L58,52 L65,52 L65,42 L70,42 L70,35 L75,35 L75,42 L80,42 L80,52
            L97,52 L97,72 L112,72 L112,58 L119,58 L119,48 L124,48 L124,58 L132,58 L132,72
            L148,72 L148,85 L162,85 L162,62 L169,62 L169,52 L174,52 L174,45 L179,45 L179,52
            L184,52 L184,62 L198,62 L198,78 L215,78 L215,90 L228,90 L228,68 L236,68 L236,56
            L241,56 L241,50 L246,50 L246,56 L251,56 L251,68 L265,68 L265,82
            L278,82 L278,66 L286,66 L286,53 L291,53 L291,46 L296,46 L296,53 L301,53 L301,66
            L315,66 L315,78 L328,78 L328,60 L336,60 L336,50 L341,50 L341,44 L346,44 L346,50
            L351,50 L351,60 L366,60 L366,72 L374,72 L374,58 L379,58 L379,50 L383,50 L383,58
            L388,58 L388,72 L390,72 L390,120 Z"
            fill="url(#cityGlow)"
          />
          {/* Main building silhouette */}
          <path
            d="M0,120 L0,90 L18,90 L18,70 L26,70 L26,62 L31,62 L31,56 L36,56 L36,62 L41,62 L41,70
            L58,70 L58,54 L65,54 L65,44 L70,44 L70,37 L75,37 L75,44 L80,44 L80,54
            L97,54 L97,74 L112,74 L112,60 L119,60 L119,50 L124,50 L124,60 L132,60 L132,74
            L148,74 L148,87 L162,87 L162,64 L169,64 L169,54 L174,54 L174,47 L179,47 L179,54
            L184,54 L184,64 L198,64 L198,80 L215,80 L215,92 L228,92 L228,70 L236,70 L236,58
            L241,58 L241,52 L246,52 L246,58 L251,58 L251,70 L265,70 L265,84
            L278,84 L278,68 L286,68 L286,55 L291,55 L291,48 L296,48 L296,55 L301,55 L301,68
            L315,68 L315,80 L328,80 L328,62 L336,62 L336,52 L341,52 L341,46 L346,46 L346,52
            L351,52 L351,62 L366,62 L366,74 L374,74 L374,60 L379,60 L379,52 L383,52 L383,60
            L388,60 L388,74 L390,74 L390,120 Z"
            fill="url(#cityFill)"
          />
          {/* Lit windows */}
          {WINDOWS.map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="0.5"
              fill="#f59e0b" opacity={0.35 + (i % 3) * 0.15} />
          ))}
          {/* Purple accent windows */}
          <rect x="72" y="40" width="3" height="2" rx="0.5" fill="#a78bfa" opacity="0.5" />
          <rect x="243" y="54" width="3" height="2" rx="0.5" fill="#a78bfa" opacity="0.45" />
          <rect x="339" y="47" width="3" height="2" rx="0.5" fill="#a78bfa" opacity="0.5" />
        </svg>

        {/* Hero text content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', paddingBottom: 108,
          paddingLeft: 24, paddingRight: 24,
        }}>
          <p style={{
            fontSize: 11, fontWeight: 600, letterSpacing: '0.18em',
            color: '#a78bfa', textTransform: 'uppercase',
            fontFamily: "'Inter', sans-serif",
            marginBottom: 8,
          }}>
            ✦ Нийгмийн дедукц тоглоом ✦
          </p>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900, fontSize: 34,
            lineHeight: 1.1, marginBottom: 4,
            color: '#f8fafc',
          }}>
            Найзуудтайгаа
          </h1>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 900, fontSize: 34,
            lineHeight: 1.1,
            background: 'linear-gradient(90deg, #a78bfa, #c4b5fd)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            нууц тоглоорой
          </h1>
        </div>
      </section>

      {/* ── PRIMARY ACTIONS ── */}
      <div style={{ padding: '0 20px', marginTop: -16, position: 'relative', zIndex: 10, display: 'flex', gap: 12 }}>
        <button
          onClick={() => ctx.navigate('create-room')}
          className="press"
          style={{
            flex: 1, minHeight: 54,
            background: 'linear-gradient(135deg, #7c3aed, #9333ea)',
            border: 'none', borderRadius: 16,
            color: 'white', fontSize: 15, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer', letterSpacing: '0.01em',
            boxShadow: '0 0 24px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>🏠</span>
          Өрөө үүсгэх
        </button>
        <button
          onClick={() => ctx.navigate('join-room')}
          className="press"
          style={{
            flex: 1, minHeight: 54,
            background: 'rgba(124,58,237,0.12)',
            border: '1.5px solid rgba(124,58,237,0.4)',
            borderRadius: 16,
            color: '#c4b5fd', fontSize: 15, fontWeight: 700,
            fontFamily: "'Outfit', sans-serif",
            cursor: 'pointer', letterSpacing: '0.01em',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>🔑</span>
          Кодоор нэгдэх
        </button>
      </div>

      {/* ── POPULAR GAMES ── */}
      <section style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 14 }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', margin: 0 }}>
            Алдартай тоглоомууд
          </h2>
          <button
            onClick={() => ctx.navigate('explore')}
            style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
          >
            Бүгд →
          </button>
        </div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 4px', WebkitOverflowScrolling: 'touch' }}>
          {FEATURED.map((game) => (
            <button
              key={game.id}
              onClick={() => ctx.navigate('game-detail', { gameId: game.id })}
              className="press"
              style={{
                flexShrink: 0, width: 152, height: 192,
                background: `linear-gradient(160deg, ${game.gradientFrom} 0%, ${game.gradientTo} 100%)`,
                border: `1px solid ${game.color}22`,
                borderRadius: 20,
                cursor: 'pointer', textAlign: 'left',
                padding: 0, overflow: 'hidden',
                boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${game.color}18`,
                display: 'flex', flexDirection: 'column',
              }}
            >
              {/* Card header */}
              <div style={{
                padding: '16px 14px 10px',
                flex: 1,
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, marginBottom: 10,
                  border: `1px solid ${game.color}30`,
                }}>
                  {game.icon}
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800, fontSize: 15,
                  color: 'white', lineHeight: 1.2, marginBottom: 6,
                }}>
                  {game.name}
                </div>
                <div style={{
                  fontSize: 11, color: 'rgba(255,255,255,0.65)',
                  fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
                  flex: 1,
                }}>
                  {game.description}
                </div>
              </div>
              {/* Card footer */}
              <div style={{
                padding: '8px 14px 12px',
                background: 'rgba(0,0,0,0.25)',
                borderTop: `1px solid ${game.color}20`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                  👥 {game.players}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 600, fontFamily: "'Inter', sans-serif",
                  color: DIFFICULTY_COLOR[game.difficulty],
                  background: `${DIFFICULTY_COLOR[game.difficulty]}18`,
                  padding: '2px 7px', borderRadius: 20,
                  border: `1px solid ${DIFFICULTY_COLOR[game.difficulty]}30`,
                }}>
                  {game.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── RECENT ROOMS ── */}
      <section style={{ marginTop: 28, padding: '0 20px' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', marginBottom: 12 }}>
          Сүүлийн өрөөнүүд
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentRooms.map((room) => {
            const game = games.find(g => g.id === room.gameId)
            return (
              <div
                key={room.code}
                style={{
                  background: '#131829',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                  background: game ? `linear-gradient(135deg, ${game.gradientFrom}, ${game.gradientTo})` : '#1a2035',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                  border: `1px solid ${game?.color ?? '#333'}30`,
                }}>
                  {game?.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9', marginBottom: 2 }}>
                    {room.game}
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
                    {room.players}/{room.maxPlayers} тоглогч · {room.hoursAgo}ц өмнө
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: '#a78bfa', letterSpacing: '0.12em',
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {room.code}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => copyCode(room.code)}
                      style={{
                        background: copied === room.code ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                        border: `1px solid ${copied === room.code ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
                        borderRadius: 8, padding: '4px 10px',
                        fontSize: 11, fontWeight: 600,
                        color: copied === room.code ? '#10b981' : '#a78bfa',
                        cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                        transition: 'all 0.2s',
                      }}
                    >
                      {copied === room.code ? '✓ Хуулсан' : 'Хуулах'}
                    </button>
                    <button
                      onClick={() => ctx.navigate('join-room')}
                      style={{
                        background: 'rgba(124,58,237,0.2)',
                        border: '1px solid rgba(124,58,237,0.35)',
                        borderRadius: 8, padding: '4px 10px',
                        fontSize: 11, fontWeight: 600,
                        color: '#c4b5fd', cursor: 'pointer',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Нэгдэх
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ marginTop: 28, padding: '0 20px' }}>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9', marginBottom: 16 }}>
          Хэрхэн тоглох вэ?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { n: '1', icon: '🏠', title: 'Өрөө үүсгэх', desc: 'Тоглоом сонгоод өрөө нээ' },
            { n: '2', icon: '🔗', title: 'Найзаа урих', desc: 'Код эсвэл QR-оор урь' },
            { n: '3', icon: '🎮', title: 'Тоглоорой!', desc: 'Хамтдаа эхлүүл' },
          ].map(step => (
            <div
              key={step.n}
              style={{
                background: '#131829',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '16px 12px',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.1))',
                border: '1px solid rgba(124,58,237,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, margin: '0 auto 10px',
              }}>
                {step.icon}
              </div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 12, color: '#e2e8f0', marginBottom: 4 }}>
                {step.title}
              </div>
              <div style={{ fontSize: 10.5, color: '#475569', fontFamily: "'Inter', sans-serif", lineHeight: 1.4 }}>
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MOOD BANNER ── */}
      <section style={{ margin: '28px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(167,139,250,0.08))',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 20, padding: '20px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 36 }}>🎭</div>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 15, color: '#f1f5f9', marginBottom: 4 }}>
              8 өөр тоглоом, нэг платформ
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
              Мафиа, Avalon, Imposter болон бусад тоглоомыг нэг дор тоглоорой.
            </div>
          </div>
        </div>
      </section>

      <BottomNav ctx={ctx} />
    </div>
  )
}
