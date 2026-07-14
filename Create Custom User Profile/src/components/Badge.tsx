type BadgeVariant = 'online' | 'offline' | 'party' | 'strategy' | 'host'

const variants: Record<BadgeVariant, { label: string; bg: string; color: string }> = {
  online: { label: 'ONLINE', bg: 'rgba(99,102,241,0.18)', color: '#818CF8' },
  offline: { label: 'OFFLINE', bg: 'rgba(52,211,153,0.15)', color: '#34D399' },
  party: { label: 'PARTY', bg: 'rgba(251,146,60,0.15)', color: '#FB923C' },
  strategy: { label: 'STRATEGY', bg: 'rgba(253,224,71,0.12)', color: '#FCD34D' },
  host: { label: 'ХОСТ', bg: 'rgba(167,139,250,0.18)', color: '#A78BFA' },
}

interface BadgeProps {
  variant: BadgeVariant
  small?: boolean
}

export default function Badge({ variant, small = false }: BadgeProps) {
  const v = variants[variant]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: v.bg,
        color: v.color,
        borderRadius: 6,
        border: `1px solid ${v.color}30`,
        fontFamily: 'var(--font-mono)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        fontSize: small ? 9 : 10,
        padding: small ? '2px 5px' : '3px 7px',
        lineHeight: 1,
      }}
    >
      {v.label}
    </span>
  )
}
