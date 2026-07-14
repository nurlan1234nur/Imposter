import { useEffect } from 'react'
import Logo from '../components/Logo'
import StarField from '../components/StarField'

interface SplashScreenProps {
  onDone: () => void
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 80% 60% at 50% 30%, #1a0b3e 0%, #0a0d1f 50%, #060A18 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        gap: 0,
      }}
    >
      <StarField count={80} />

      {/* Glow blob */}
      <div
        style={{
          position: 'absolute',
          width: 280,
          height: 280,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          animation: 'splashFadeIn 0.8s ease both',
        }}
      >
        <Logo size={72} glow />
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: '#EEF2FF',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1,
            }}
          >
            Сэжиг
          </h1>
          <p style={{ fontSize: 14, color: '#7886A8', marginTop: 6, letterSpacing: '0.1em' }}>
            Нийгмийн дедукц тоглоом
          </p>
        </div>
      </div>

      {/* Loading dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          display: 'flex',
          gap: 6,
          animation: 'splashFadeIn 0.8s 0.8s ease both',
          opacity: 0,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#7C3AED',
              animation: `dotPulse 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
