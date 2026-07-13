import { useState } from 'react'
import type { AppCtx } from '../App'
import BottomNav from '../components/BottomNav'

interface Props { ctx: AppCtx }

const LANGUAGES = [
  { code: 'mn', flag: '🇲🇳', name: 'Монгол', native: 'Монгол хэл' },
  { code: 'en', flag: '🇬🇧', name: 'English', native: 'English' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский', native: 'Русский язык' },
  { code: 'zh', flag: '🇨🇳', name: 'Chinese', native: '中文' },
  { code: 'jp', flag: '🇯🇵', name: 'Japanese', native: '日本語' },
]

const AVATARS = ['🦊', '🐺', '🦅', '🐉', '🌙', '⚡', '🔮', '🎭', '🌑', '🗡️', '🌊', '🔥']

export default function SettingsScreen({ ctx }: Props) {
  const [name, setName] = useState(ctx.playerName || '')
  const [avatar, setAvatar] = useState('🦊')
  const [langExpanded, setLangExpanded] = useState(false)
  const [nameSaved, setNameSaved] = useState(false)
  const [sounds, setSounds] = useState(true)
  const [haptics, setHaptics] = useState(true)
  const [notifications, setNotifications] = useState(false)

  const saveName = () => {
    if (!name.trim()) return
    ctx.setPlayerName(name.trim())
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  const currentLang = LANGUAGES.find(l => l.code === ctx.language) ?? LANGUAGES[0]

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', overflowY: 'auto', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 22, color: '#f1f5f9' }}>
          ⚙️ Профайл & Тохиргоо
        </h1>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Profile card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.06))',
          border: '1px solid rgba(124,58,237,0.25)',
          borderRadius: 22, padding: '22px 20px', marginBottom: 20,
        }}>
          {/* Avatar selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div style={{
              width: 68, height: 68, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.1))',
              border: '2px solid rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36,
              boxShadow: '0 0 20px rgba(124,58,237,0.25)',
            }}>
              {avatar}
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 18, color: '#f1f5f9' }}>
                {ctx.playerName || 'Тоглогч'}
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontFamily: "'Inter', sans-serif", marginTop: 2 }}>
                Профайл тохируулах
              </div>
            </div>
          </div>

          {/* Avatar grid */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif", marginBottom: 10 }}>
              АВАТАР
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AVATARS.map(av => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: avatar === av ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.05)',
                    border: avatar === av ? '1.5px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    fontSize: 22, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    boxShadow: avatar === av ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Name input */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>
              НЭРИЙН ТЭМДЭГЛЭЛ
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveName()}
                placeholder="Нэрээ оруулах..."
                maxLength={20}
                style={{
                  flex: 1, height: 48,
                  background: '#0d1117',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  padding: '0 14px',
                  color: '#f1f5f9', fontSize: 15, fontWeight: 600,
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
              <button
                onClick={saveName}
                style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: nameSaved ? 'rgba(16,185,129,0.2)' : 'rgba(124,58,237,0.2)',
                  border: `1px solid ${nameSaved ? 'rgba(16,185,129,0.35)' : 'rgba(124,58,237,0.35)'}`,
                  color: nameSaved ? '#6ee7b7' : '#a78bfa',
                  fontSize: 18, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {nameSaved ? '✓' : '💾'}
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div style={{
          background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, overflow: 'hidden', marginBottom: 16,
        }}>
          <button
            onClick={() => setLangExpanded(e => !e)}
            style={{
              width: '100%', padding: '16px 18px',
              background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', gap: 14,
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 22 }}>{currentLang.flag}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#f1f5f9' }}>
                Хэл / Language
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontFamily: "'Inter', sans-serif" }}>
                {currentLang.native}
              </div>
            </div>
            <span style={{ color: '#475569', fontSize: 14, transform: langExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
          </button>
          {langExpanded && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { ctx.setLanguage(lang.code as 'mn' | 'en'); setLangExpanded(false) }}
                  style={{
                    width: '100%', padding: '13px 18px',
                    background: ctx.language === lang.code ? 'rgba(124,58,237,0.1)' : 'none',
                    border: 'none',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', gap: 14,
                    cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 20 }}>{lang.flag}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: ctx.language === lang.code ? '#c4b5fd' : '#f1f5f9' }}>
                      {lang.native}
                    </div>
                    <div style={{ fontSize: 11, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      {lang.name}
                    </div>
                  </div>
                  {ctx.language === lang.code && (
                    <span style={{ color: '#a78bfa', fontSize: 16 }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Preferences */}
        <div style={{
          background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, overflow: 'hidden', marginBottom: 16,
        }}>
          <div style={{ padding: '14px 18px 10px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#94a3b8' }}>
            ТОХИРГОО
          </div>
          {[
            { icon: '🔊', label: 'Дуу', desc: 'Тоглоомын дуу', value: sounds, set: setSounds },
            { icon: '📳', label: 'Чичиргэт', desc: 'Гарны чичиргэт', value: haptics, set: setHaptics },
            { icon: '🔔', label: 'Мэдэгдэл', desc: 'Push мэдэгдэл', value: notifications, set: setNotifications },
          ].map((pref, i) => (
            <div key={pref.label} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '13px 18px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{pref.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 13, color: '#f1f5f9' }}>
                  {pref.label}
                </div>
                <div style={{ fontSize: 11, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                  {pref.desc}
                </div>
              </div>
              <button
                onClick={() => pref.set(!pref.value)}
                style={{
                  width: 48, height: 28, borderRadius: 14,
                  background: pref.value ? '#7c3aed' : '#1a2035',
                  border: 'none', cursor: 'pointer',
                  position: 'relative', transition: 'background 0.2s',
                  boxShadow: pref.value ? '0 0 10px rgba(124,58,237,0.4)' : 'none',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: 'white',
                  position: 'absolute', top: 4,
                  left: pref.value ? 24 : 4,
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                }} />
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{
          background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, padding: '18px 18px', marginBottom: 16,
        }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#94a3b8', marginBottom: 14 }}>
            СТАТИСТИК
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { val: '12', label: 'Тоглосон' },
              { val: '7', label: 'Ялсан' },
              { val: '58%', label: 'Ялалт' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 26, color: '#a78bfa' }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: 11, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div style={{
          background: '#131829', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 18, overflow: 'hidden', marginBottom: 20,
        }}>
          <div style={{ padding: '14px 18px 10px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: '#94a3b8' }}>
            ТУХАЙ
          </div>
          {[
            { label: 'Хувилбар', value: '1.0.0' },
            { label: 'Тоглоомуудын тоо', value: '8' },
            { label: 'Дэмжлэг', value: 'help@onlain-oroo.mn' },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 18px',
              borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
            }}>
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: "'Inter', sans-serif" }}>{item.label}</span>
              <span style={{ fontSize: 13, color: '#64748b', fontFamily: "'Inter', sans-serif" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🌙</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 16, color: '#475569', marginBottom: 4 }}>
            Онлайн өрөө
          </div>
          <div style={{ fontSize: 11, color: '#334155', fontFamily: "'Inter', sans-serif" }}>
            Нийгмийн дедукц тоглоомын платформ
          </div>
        </div>
      </div>

      <BottomNav ctx={ctx} />
    </div>
  )
}
