interface LogoProps {
  size?: number
  glow?: boolean
}

export default function Logo({ size = 32, glow = false }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={glow ? { filter: 'drop-shadow(0 0 8px rgba(167,139,250,0.6))' } : undefined}
    >
      {/* Crescent moon */}
      <circle cx="20" cy="20" r="16" fill="url(#moon-fill)" />
      <circle cx="27" cy="15" r="11" fill="#0C1428" />
      {/* Eye in the crescent */}
      <ellipse cx="14" cy="23" rx="5" ry="3.5" fill="rgba(167,139,250,0.15)" />
      <ellipse cx="14" cy="23" rx="3" ry="2.2" fill="#A78BFA" />
      <circle cx="14" cy="23" r="1.3" fill="#2D1B69" />
      <circle cx="14.7" cy="22.3" r="0.5" fill="white" opacity="0.9" />
      {/* Stars */}
      <circle cx="30" cy="10" r="1" fill="#A78BFA" opacity="0.8" />
      <circle cx="8" cy="12" r="0.7" fill="#818CF8" opacity="0.6" />
      <circle cx="34" cy="25" r="0.8" fill="#C4B5FD" opacity="0.7" />
      <defs>
        <radialGradient id="moon-fill" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4C1D95" />
        </radialGradient>
      </defs>
    </svg>
  )
}
