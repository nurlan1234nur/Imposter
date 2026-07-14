type Tab = 'home' | 'join' | 'settings'

interface BottomNavProps {
  active: Tab
  onNavigate: (tab: Tab) => void
}

const tabs = [
  {
    id: 'home' as Tab,
    label: 'Нүүр',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
          fill={active ? '#A78BFA' : 'none'}
          stroke={active ? '#A78BFA' : '#7886A8'}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'join' as Tab,
    label: 'Нэгдэх',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3" y="6" width="18" height="12" rx="3"
          fill={active ? 'rgba(167,139,250,0.15)' : 'none'}
          stroke={active ? '#A78BFA' : '#7886A8'}
          strokeWidth="1.8"
        />
        <path d="M7 12H17M13 9L17 12L13 15" stroke={active ? '#A78BFA' : '#7886A8'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'settings' as Tab,
    label: 'Дэлгэрэнгүй',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={active ? '#A78BFA' : '#7886A8'} strokeWidth="1.8" />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={active ? '#A78BFA' : '#7886A8'}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
]

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 480,
        background: 'rgba(8,13,31,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(167,139,250,0.1)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0 env(safe-area-inset-bottom, 8px)',
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '6px 20px',
            borderRadius: 10,
            transition: 'opacity 0.15s',
            outline: 'none',
          }}
        >
          {tab.icon(active === tab.id)}
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: active === tab.id ? '#A78BFA' : '#7886A8',
              fontFamily: 'var(--font-sans)',
              transition: 'color 0.15s',
            }}
          >
            {tab.label}
          </span>
          {active === tab.id && (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#A78BFA', marginTop: -2 }} />
          )}
        </button>
      ))}
    </div>
  )
}
