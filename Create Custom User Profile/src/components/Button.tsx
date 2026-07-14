import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  fullWidth?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const styles: Record<Variant, { bg: string; color: string; border: string; hover: string }> = {
  primary: {
    bg: 'linear-gradient(135deg, #7C3AED, #6366F1)',
    color: '#fff',
    border: 'none',
    hover: 'brightness(1.1)',
  },
  secondary: {
    bg: 'rgba(124,58,237,0.12)',
    color: '#A78BFA',
    border: '1px solid rgba(124,58,237,0.3)',
    hover: 'brightness(1.15)',
  },
  ghost: {
    bg: 'rgba(255,255,255,0.04)',
    color: '#C7D2FE',
    border: '1px solid rgba(255,255,255,0.08)',
    hover: 'brightness(1.2)',
  },
  danger: {
    bg: 'rgba(239,68,68,0.12)',
    color: '#F87171',
    border: '1px solid rgba(239,68,68,0.25)',
    hover: 'brightness(1.1)',
  },
}

const sizes = {
  sm: { padding: '8px 14px', fontSize: 13, borderRadius: 10 },
  md: { padding: '12px 20px', fontSize: 15, borderRadius: 12 },
  lg: { padding: '16px 24px', fontSize: 16, borderRadius: 14 },
}

export default function Button({
  variant = 'primary',
  children,
  fullWidth = false,
  size = 'md',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const v = styles[variant]
  const s = sizes[size]
  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : undefined,
        background: disabled ? 'rgba(255,255,255,0.06)' : v.bg,
        color: disabled ? '#4B5563' : v.color,
        border: disabled ? '1px solid rgba(255,255,255,0.06)' : v.border,
        borderRadius: s.borderRadius,
        padding: s.padding,
        fontSize: s.fontSize,
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'filter 0.15s, transform 0.1s',
        outline: 'none',
        letterSpacing: '0.01em',
        boxShadow: variant === 'primary' && !disabled
          ? '0 4px 20px rgba(124,58,237,0.35)'
          : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.filter = v.hover
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.filter = ''
      }}
      onMouseDown={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)'
      }}
      onMouseUp={(e) => {
        ;(e.currentTarget as HTMLButtonElement).style.transform = ''
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
