import { useMemo } from 'react'

export default function StarField({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 4,
    }))
  }, [count])

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {stars.map((s) => (
        <circle
          key={s.id}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          fill="#A78BFA"
          opacity={s.opacity}
        >
          <animate
            attributeName="opacity"
            values={`${s.opacity};${s.opacity * 0.3};${s.opacity}`}
            dur={`${s.dur}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}
