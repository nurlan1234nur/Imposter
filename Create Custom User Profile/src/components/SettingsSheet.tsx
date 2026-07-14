import { useState, useEffect } from 'react'
import Button from './Button'

interface SettingsSheetProps {
  open: boolean
  onClose: () => void
  playerName: string
  onNameChange: (n: string) => void
}

const LANGS = [
  { code: 'mn', label: 'Монгол' },
  { code: 'en', label: 'English' },
  { code: 'kk', label: 'Қазақша' },
]

export default function SettingsSheet({ open, onClose, playerName, onNameChange }: SettingsSheetProps) {
  const [name, setName] = useState(playerName)
  const [lang, setLang] = useState('mn')
  const [sound, setSound] = useState(true)
  const [vibration, setVibration] = useState(true)
  const [reduced, setReduced] = useState(false)

  useEffect(() => { setName(playerName) }, [playerName])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        background: 'rgba(6,10,24,0.7)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0C1428',
          borderRadius: '20px 20px 0 0',
          border: '1px solid rgba(167,139,250,0.12)',
          borderBottom: 'none',
          padding: '0 0 env(safe-area-inset-bottom)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        <div style={{ padding: '4px 24px 32px' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24, color: '#EEF2FF' }}>
            Тохиргоо
          </h2>

          {/* Player name */}
          <Section label="Тоглогчийн нэр">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Нэрээ оруулна уу..."
              style={inputStyle}
            />
          </Section>

          {/* Language */}
          <Section label="Хэл">
            <div style={{ display: 'flex', gap: 8 }}>
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    flex: 1,
                    padding: '10px 8px',
                    borderRadius: 10,
                    border: `1px solid ${lang === l.code ? '#7C3AED' : 'rgba(255,255,255,0.08)'}`,
                    background: lang === l.code ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.04)',
                    color: lang === l.code ? '#A78BFA' : '#8892B0',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all 0.15s',
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Toggles */}
          <Section label="Тохиргоо">
            <Toggle label="Дуу" value={sound} onChange={setSound} />
            <Toggle label="Чичиргаа" value={vibration} onChange={setVibration} />
            <Toggle label="Хөдөлгөөн багасгах" value={reduced} onChange={setReduced} />
          </Section>

          {/* About */}
          <Section label="Тухай">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <InfoRow label="Хувилбар" value="2.1.0" />
              <InfoRow label="Бүтээгч" value="Сэжиг Team" />
            </div>
            <button style={{ ...linkStyle, marginTop: 12 }}>Тоглоомын дүрэм →</button>
          </Section>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={() => { onNameChange(name); onClose() }}
            style={{ marginTop: 8 }}
          >
            Хадгалах
          </Button>
        </div>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: '#7886A8', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      <span style={{ fontSize: 15, color: '#C7D2FE' }}>{label}</span>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          border: 'none',
          background: value ? 'linear-gradient(135deg, #7C3AED, #6366F1)' : 'rgba(255,255,255,0.1)',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          outline: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: value ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
      <span style={{ color: '#7886A8', fontSize: 14 }}>{label}</span>
      <span style={{ color: '#C7D2FE', fontSize: 14 }}>{value}</span>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(167,139,250,0.18)',
  borderRadius: 12,
  padding: '12px 16px',
  color: '#EEF2FF',
  fontSize: 15,
  outline: 'none',
}

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#818CF8',
  fontSize: 14,
  cursor: 'pointer',
  padding: 0,
  fontFamily: 'var(--font-sans)',
}
