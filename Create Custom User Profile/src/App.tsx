import { useState } from 'react'
import SplashScreen from './screens/SplashScreen'
import HomeScreen from './screens/HomeScreen'
import JoinScreen from './screens/JoinScreen'
import GameDetailScreen from './screens/GameDetailScreen'
import OfflineSetupScreen from './screens/OfflineSetupScreen'
import WaitingRoomScreen from './screens/WaitingRoomScreen'
import { MafiaSetupScreen, MafiaGameScreen } from './screens/MafiaGame'
import SettingsSheet from './components/SettingsSheet'
import BottomNav from './components/BottomNav'
import type { Game } from './data/games'
import { GAMES } from './data/games'

type Screen =
  | 'splash'
  | 'home'
  | 'join'
  | 'game-detail'
  | 'offline-setup'
  | 'waiting-room'
  | 'mafia-setup'
  | 'mafia-game'

type BottomTab = 'home' | 'join' | 'settings'

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [tab, setTab] = useState<BottomTab>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [playerName, setPlayerName] = useState('Тоглогч')
  const [selectedGame, setSelectedGame] = useState<Game>(GAMES[0])
  const [roomCode] = useState(genCode())

  const showNav = screen === 'home' || screen === 'join'

  const handleTabNav = (t: BottomTab) => {
    if (t === 'settings') { setSettingsOpen(true); return }
    setTab(t)
    setScreen(t === 'home' ? 'home' : 'join')
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
    setScreen('game-detail')
  }

  const handleCreateRoom = (game: Game) => {
    setSelectedGame(game)
    if (game.id === 'mafia') { setScreen('mafia-setup'); return }
    setScreen('waiting-room')
  }

  const handleOfflineSetup = (game: Game) => {
    setSelectedGame(game)
    setScreen('offline-setup')
  }

  const handleJoined = (_code: string) => {
    setScreen('waiting-room')
  }

  const handleStartGame = () => {
    if (selectedGame.id === 'mafia') {
      setScreen('mafia-game')
    } else {
      setScreen('mafia-game')
    }
  }

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        maxWidth: 480,
        margin: '0 auto',
        background: '#060A18',
        position: 'relative',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {screen === 'splash' && <SplashScreen onDone={() => setScreen('home')} />}

      {screen === 'home' && (
        <HomeScreen
          playerName={playerName}
          onGameSelect={handleGameSelect}
          onOpenSettings={() => setSettingsOpen(true)}
          onJoin={() => setScreen('join')}
        />
      )}

      {screen === 'join' && (
        <JoinScreen
          onBack={() => setScreen('home')}
          onJoined={handleJoined}
        />
      )}

      {screen === 'game-detail' && (
        <GameDetailScreen
          game={selectedGame}
          playerName={playerName}
          onBack={() => setScreen('home')}
          onCreateRoom={handleCreateRoom}
          onOfflineSetup={handleOfflineSetup}
        />
      )}

      {screen === 'offline-setup' && (
        <OfflineSetupScreen
          game={selectedGame}
          onBack={() => setScreen('game-detail')}
          onStart={() => setScreen('mafia-game')}
        />
      )}

      {screen === 'waiting-room' && (
        <WaitingRoomScreen
          game={selectedGame}
          roomCode={roomCode}
          playerName={playerName}
          isHost
          onBack={() => setScreen('game-detail')}
          onStartGame={handleStartGame}
        />
      )}

      {screen === 'mafia-setup' && (
        <MafiaSetupScreen
          onBack={() => setScreen('game-detail')}
          onStart={() => setScreen('mafia-game')}
        />
      )}

      {screen === 'mafia-game' && (
        <MafiaGameScreen onBack={() => setScreen('home')} />
      )}

      {/* Settings sheet (overlay) */}
      <SettingsSheet
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        playerName={playerName}
        onNameChange={setPlayerName}
      />

      {/* Bottom nav — only on top-level screens */}
      {showNav && (
        <BottomNav
          active={tab}
          onNavigate={handleTabNav}
        />
      )}
    </div>
  )
}
