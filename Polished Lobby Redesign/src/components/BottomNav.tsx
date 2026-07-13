import type { AppCtx, Screen } from '../App'

interface Props { ctx: AppCtx }

const tabs: { id: Screen; label: string; icon: (active: boolean) => React.ReactNode }[] = [
  {
    id: 'home',
    label: 'Нүүр',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={a ? '#a78bfa' : 'none'} stroke={a ? '#a78bfa' : '#64748b'} strokeWidth="1.8">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" strokeLinejoin="round" />
        <path d="M9 21V12h6v9" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Тоглоомууд',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#a78bfa' : '#64748b'} strokeWidth="1.8">
        <rect x="2" y="6" width="8" height="8" rx="1.5" fill={a ? 'rgba(167,139,250,0.2)' : 'none'} />
        <rect x="14" y="6" width="8" height="8" rx="1.5" fill={a ? 'rgba(167,139,250,0.2)' : 'none'} />
        <rect x="2" y="16" width="8" height="6" rx="1.5" fill={a ? 'rgba(167,139,250,0.2)' : 'none'} />
        <rect x="14" y="16" width="8" height="6" rx="1.5" fill={a ? 'rgba(167,139,250,0.2)' : 'none'} />
      </svg>
    ),
  },
  {
    id: 'how-to-play',
    label: 'Заавар',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#a78bfa' : '#64748b'} strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" fill={a ? 'rgba(167,139,250,0.15)' : 'none'} />
        <path d="M12 17v-5" strokeLinecap="round" />
        <circle cx="12" cy="8" r="0.8" fill={a ? '#a78bfa' : '#64748b'} />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Профайл',
    icon: (a) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? '#a78bfa' : '#64748b'} strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.5" fill={a ? 'rgba(167,139,250,0.2)' : 'none'} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function BottomNav({ ctx }: Props) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'rgba(7,9,15,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0 4px' }}>
        {tabs.map(tab => {
          const active = ctx.activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => ctx.navigate(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '6px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                minWidth: 60,
                minHeight: 44,
                justifyContent: 'center',
                transition: 'opacity 0.15s',
              }}
            >
              <div style={{ position: 'relative' }}>
                {tab.icon(active)}
                {active && (
                  <div style={{
                    position: 'absolute',
                    bottom: -6,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: '#a78bfa',
                    boxShadow: '0 0 6px #a78bfa',
                  }} />
                )}
              </div>
              <span style={{
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                fontWeight: active ? 600 : 400,
                color: active ? '#a78bfa' : '#475569',
                letterSpacing: '0.01em',
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
