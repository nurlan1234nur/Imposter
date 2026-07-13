import { useState } from 'react'
import HomeScreen from './screens/HomeScreen'
import ExploreScreen from './screens/ExploreScreen'
import GameDetailScreen from './screens/GameDetailScreen'
import CreateRoomScreen from './screens/CreateRoomScreen'
import JoinRoomScreen from './screens/JoinRoomScreen'
import WaitingRoomScreen from './screens/WaitingRoomScreen'
import HowToPlayScreen from './screens/HowToPlayScreen'
import SettingsScreen from './screens/SettingsScreen'

export type Screen =
  | 'home'
  | 'explore'
  | 'game-detail'
  | 'create-room'
  | 'join-room'
  | 'waiting-room'
  | 'how-to-play'
  | 'settings'

export interface NavParams {
  gameId?: string
  roomCode?: string
}

export interface AppCtx {
  navigate: (screen: Screen, params?: NavParams) => void
  back: () => void
  selectedGameId: string | null
  playerName: string
  setPlayerName: (n: string) => void
  roomCode: string | null
  setRoomCode: (c: string | null) => void
  language: 'mn' | 'en'
  setLanguage: (l: 'mn' | 'en') => void
  activeTab: Screen
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [history, setHistory] = useState<Screen[]>([])
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [language, setLanguage] = useState<'mn' | 'en'>('mn')

  const navigate = (s: Screen, params?: NavParams) => {
    setHistory(h => [...h, screen])
    if (params?.gameId !== undefined) setSelectedGameId(params.gameId)
    if (params?.roomCode !== undefined) setRoomCode(params.roomCode)
    setScreen(s)
  }

  const back = () => {
    const prev = history[history.length - 1]
    if (prev) {
      setHistory(h => h.slice(0, -1))
      setScreen(prev)
    } else {
      setScreen('home')
    }
  }

  const tabScreens: Screen[] = ['home', 'explore', 'how-to-play', 'settings']
  const activeTab: Screen = tabScreens.includes(screen)
    ? screen
    : ([...history].reverse().find(s => tabScreens.includes(s)) ?? 'home')

  const ctx: AppCtx = {
    navigate, back, selectedGameId, playerName, setPlayerName,
    roomCode, setRoomCode, language, setLanguage, activeTab,
  }

  const screenMap: Record<Screen, React.ReactNode> = {
    'home': <HomeScreen ctx={ctx} />,
    'explore': <ExploreScreen ctx={ctx} />,
    'game-detail': <GameDetailScreen ctx={ctx} />,
    'create-room': <CreateRoomScreen ctx={ctx} />,
    'join-room': <JoinRoomScreen ctx={ctx} />,
    'waiting-room': <WaitingRoomScreen ctx={ctx} />,
    'how-to-play': <HowToPlayScreen ctx={ctx} />,
    'settings': <SettingsScreen ctx={ctx} />,
  }

  return (
    <div style={{ minHeight: '100svh', background: '#07090f', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100svh',
        position: 'relative',
        background: '#07090f',
        overflow: 'hidden',
      }}>
        {screenMap[screen]}
      </div>
    </div>
  )
}
