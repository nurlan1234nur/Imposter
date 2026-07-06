import { useEffect, useRef, useState } from 'react'
import { LANGS, STRINGS } from './i18n.js'
import { WORDS, nextWordIndex } from './words.js'

const MIN_PLAYERS = 3
const MAX_PLAYERS = 12
const ONLINE_TEXT = {
  en: {
    onlineRoom: 'Online room',
    back: 'Back',
    leaveRoom: 'Leave room',
    createTitle: 'Online room',
    createSubtitle: 'Create a room, share the code, then play from separate phones.',
    yourName: 'Your name',
    playerName: 'Player name',
    createRoom: 'Create room',
    roomCode: 'Room code',
    joinRoom: 'Join room',
    copy: 'Copy',
    imposterGame: 'Imposter',
    planesGame: 'Plane battle',
    numberGame: 'Number guess',
    voiceOff: 'Voice off',
    voiceOn: 'Voice on',
    voiceConnecting: 'Voice connecting',
    voiceReconnect: 'Voice reconnect needed',
    voiceMicNeeded: 'Mic permission needed',
    stopVoice: 'Stop voice',
    startVoice: 'Start voice',
    mute: 'Mute',
    unmute: 'Unmute',
    liveReconnect: 'Live connection reconnecting...',
    imposters: 'Imposters',
    startOnlineRound: 'Start online round',
    waitingHost: 'Waiting for host to start.',
    yourCard: 'Your card',
    hint: 'Hint',
    secretWord: 'Secret word',
    starts: 'starts. Discuss by voice, then vote.',
    someone: 'Someone',
    vote: 'Vote',
    voteSent: 'Vote sent',
    revealNow: 'Reveal now',
    votes: 'Votes',
    hidden: 'Hidden',
    newRound: 'New round',
    yourSecretNumber: 'Your 4 digit secret',
    ready: 'Ready',
    waiting: 'Waiting',
    yourTurn: 'Your turn',
    waitingTurn: 'Waiting for turn',
    won: 'won',
    guess: 'Guess',
    reset: 'Reset',
    placePlane: 'Place your plane. Head hit wins.',
    rotate: 'Rotate',
    readyUp: 'Ready up',
    yourTurnFire: 'Your turn to fire',
    yourBoard: 'Your board',
    target: 'Target',
    planeCount: 'Plane count',
    propose: 'Propose',
    approve: 'Approve',
    cancel: 'Cancel',
    proposalWaiting: 'Waiting for majority approval.',
    proposalIncoming: 'proposed a new plane count.',
    placedPlanes: 'Placed',
    selectPlane: 'Plane',
    eliminated: 'Out',
    alivePlanes: 'Alive',
    damagedPlanes: 'Hit',
    deadPlanes: 'Down',
  },
  mn: {
    onlineRoom: 'Онлайн өрөө',
    back: 'Буцах',
    leaveRoom: 'Өрөөнөөс гарах',
    createTitle: 'Онлайн өрөө',
    createSubtitle: 'Өрөө үүсгээд кодоо бусадтай хуваалцаж, тус тусын утаснаас тоглоно.',
    yourName: 'Таны нэр',
    playerName: 'Тоглогчийн нэр',
    createRoom: 'Өрөө үүсгэх',
    roomCode: 'Өрөөний код',
    joinRoom: 'Өрөөнд орох',
    copy: 'Хуулах',
    imposterGame: 'Imposter',
    planesGame: 'Онгоц буудах',
    numberGame: 'Тоо олох',
    voiceOff: 'Дуу унтраалттай',
    voiceOn: 'Дуу асаалттай',
    voiceConnecting: 'Дуу холбогдож байна',
    voiceReconnect: 'Дууг дахин холбох хэрэгтэй',
    voiceMicNeeded: 'Микрофоны зөвшөөрөл хэрэгтэй',
    stopVoice: 'Дуу зогсоох',
    startVoice: 'Дуу эхлүүлэх',
    mute: 'Дуу хаах',
    unmute: 'Дуу нээх',
    liveReconnect: 'Live холболт дахин холбогдож байна...',
    imposters: 'Imposter',
    startOnlineRound: 'Онлайн үе эхлүүлэх',
    waitingHost: 'Host эхлүүлэхийг хүлээж байна.',
    yourCard: 'Таны карт',
    hint: 'Сэжүүр',
    secretWord: 'Нууц үг',
    starts: 'эхэлнэ. Дуугаар ярилцаад дараа нь санал өгнө.',
    someone: 'Хэн нэгэн',
    vote: 'Санал өгөх',
    voteSent: 'Санал өгсөн',
    revealNow: 'Одоо ил болгох',
    votes: 'Санал',
    hidden: 'Нууц',
    newRound: 'Шинэ үе',
    yourSecretNumber: 'Таны 4 оронтой нууц тоо',
    ready: 'Бэлэн',
    waiting: 'Хүлээж байна',
    yourTurn: 'Таны ээлж',
    waitingTurn: 'Ээлжээ хүлээж байна',
    won: 'яллаа',
    guess: 'Таах',
    reset: 'Дахин эхлүүлэх',
    placePlane: 'Онгоцоо байрлуулна. Толгойг нь оновол ялна.',
    rotate: 'Эргүүлэх',
    readyUp: 'Бэлэн болох',
    yourTurnFire: 'Буудах таны ээлж',
    yourBoard: 'Таны талбар',
    target: 'Бай',
    planeCount: 'Онгоцны тоо',
    propose: 'Санал болгох',
    approve: 'Зөвшөөрөх',
    cancel: 'Цуцлах',
    proposalWaiting: 'Олонхийн зөвшөөрлийг хүлээж байна.',
    proposalIncoming: 'онгоцны тоо өөрчлөх санал илгээсэн.',
    placedPlanes: 'Байрласан',
    selectPlane: 'Онгоц',
    eliminated: 'Хасагдсан',
    alivePlanes: 'Амьд',
    damagedPlanes: 'Шархдсан',
    deadPlanes: 'Унасан',
  },
  kk: {
    onlineRoom: 'Онлайн бөлме',
    back: 'Артқа',
    leaveRoom: 'Бөлмеден шығу',
    createTitle: 'Онлайн бөлме',
    createSubtitle: 'Бөлме құрып, кодты бөлісіп, әркім өз телефонынан ойнайды.',
    yourName: 'Атыңыз',
    playerName: 'Ойыншы аты',
    createRoom: 'Бөлме құру',
    roomCode: 'Бөлме коды',
    joinRoom: 'Бөлмеге кіру',
    copy: 'Көшіру',
    imposterGame: 'Imposter',
    planesGame: 'Ұшақ ату',
    numberGame: 'Сан табу',
    voiceOff: 'Дауыс өшірулі',
    voiceOn: 'Дауыс қосулы',
    voiceConnecting: 'Дауыс қосылып жатыр',
    voiceReconnect: 'Дауысты қайта қосу керек',
    voiceMicNeeded: 'Микрофон рұқсаты керек',
    stopVoice: 'Дауысты тоқтату',
    startVoice: 'Дауысты бастау',
    mute: 'Дыбысты өшіру',
    unmute: 'Дыбысты қосу',
    liveReconnect: 'Live байланыс қайта қосылып жатыр...',
    imposters: 'Imposter',
    startOnlineRound: 'Онлайн раунд бастау',
    waitingHost: 'Host бастауын күтіп тұр.',
    yourCard: 'Сіздің картаңыз',
    hint: 'Кеңес',
    secretWord: 'Құпия сөз',
    starts: 'бастайды. Дауыспен сөйлесіп, кейін дауыс беріңіз.',
    someone: 'Біреу',
    vote: 'Дауыс беру',
    voteSent: 'Дауыс берілді',
    revealNow: 'Қазір ашу',
    votes: 'Дауыстар',
    hidden: 'Жасырын',
    newRound: 'Жаңа раунд',
    yourSecretNumber: 'Сіздің 4 таңбалы құпия саныңыз',
    ready: 'Дайын',
    waiting: 'Күтуде',
    yourTurn: 'Сіздің кезегіңіз',
    waitingTurn: 'Кезекті күту',
    won: 'жеңді',
    guess: 'Табу',
    reset: 'Қайта бастау',
    placePlane: 'Ұшағыңызды қойыңыз. Басынан тигізсеңіз жеңесіз.',
    rotate: 'Бұру',
    readyUp: 'Дайын болу',
    yourTurnFire: 'Ату кезегі сізде',
    yourBoard: 'Сіздің тақтаңыз',
    target: 'Нысана',
    planeCount: 'Ұшақ саны',
    propose: 'Ұсыну',
    approve: 'Қабылдау',
    cancel: 'Бас тарту',
    proposalWaiting: 'Көпшіліктің келісімін күтуде.',
    proposalIncoming: 'ұшақ санын өзгертуді ұсынды.',
    placedPlanes: 'Қойылды',
    selectPlane: 'Ұшақ',
    eliminated: 'Шықты',
    alivePlanes: 'Тірі',
    damagedPlanes: 'Жаралы',
    deadPlanes: 'Құлаған',
  },
}

function onlineText(lang) {
  return ONLINE_TEXT[lang] || ONLINE_TEXT.en
}

export default function App() {
  const [mode, setMode] = useState('local')
  const [lang, setLang] = useState('mn')
  const [screen, setScreen] = useState('setup') // setup | reveal | start | result
  const [playerCount, setPlayerCount] = useState(4)
  const [imposterCount, setImposterCount] = useState(1)
  const [names, setNames] = useState(['', '', '', ''])
  const [hostWord, setHostWord] = useState(false)
  const [allImposterEnabled, setAllImposterEnabled] = useState(false)
  const [allImposterFreq, setAllImposterFreq] = useState(10)
  const [game, setGame] = useState(null) // { wordIndex, customWord, customHint, imposters:Set, startIndex, allImposter }
  const [revealIndex, setRevealIndex] = useState(0)

  const t = STRINGS[lang]
  if (mode === 'online') return <OnlineRoom lang={lang} setLang={setLang} onBack={() => setMode('local')} />

  function setCount(n) {
    const c = Math.max(MIN_PLAYERS, Math.min(MAX_PLAYERS, n))
    setPlayerCount(c)
    setNames((prev) => {
      const next = prev.slice(0, c)
      while (next.length < c) next.push('')
      return next
    })
    if (imposterCount > c - 1) setImposterCount(c - 1)
  }

  function setName(i, v) {
    setNames((prev) => prev.map((n, idx) => (idx === i ? v : n)))
  }

  function resolvedNames() {
    return names.map((n, i) => (n.trim() ? n.trim() : `${t.playerName} ${i + 1}`))
  }

  function handleStart() {
    if (hostWord) setScreen('custom')
    else newRound(null, null)
  }

  function newRound(customW, customH) {
    const useCustom = !!customW
    // The all-imposter twist only fires on random-word rounds, by chance 1/freq.
    const allImposter =
      allImposterEnabled && !useCustom && Math.random() < 1 / allImposterFreq

    const imposters = new Set()
    if (allImposter) {
      for (let i = 0; i < playerCount; i++) imposters.add(i)
    } else {
      const exclude = useCustom ? 0 : -1 // host (player 1) is never the imposter
      while (imposters.size < imposterCount) {
        const r = Math.floor(Math.random() * playerCount)
        if (r !== exclude) imposters.add(r)
      }
    }

    setGame({
      wordIndex: useCustom ? -1 : nextWordIndex(),
      customWord: customW || '',
      customHint: customH || '',
      imposters,
      startIndex: Math.floor(Math.random() * playerCount),
      allImposter,
    })
    setRevealIndex(0)
    setScreen('reveal')
  }

  function playAgain() {
    if (hostWord) setScreen('custom')
    else newRound(null, null)
  }

  // Resolve the word/hint to show (from the bank, or the host's custom entry).
  let word = '', hint = ''
  if (game) {
    const entry = game.wordIndex >= 0 ? WORDS[game.wordIndex] : null
    word = entry ? entry.word[lang] : game.customWord
    hint = entry ? entry.hint[lang] : game.customHint
  }

  function nextReveal() {
    if (revealIndex + 1 < playerCount) {
      setRevealIndex(revealIndex + 1)
    } else {
      setScreen('start')
    }
  }

  return (
    <div className="app">
      {screen === 'setup' && (
        <Setup
          t={t}
          lang={lang}
          setLang={setLang}
          playerCount={playerCount}
          setCount={setCount}
          imposterCount={imposterCount}
          setImposterCount={setImposterCount}
          names={names}
          setName={setName}
          hostWord={hostWord}
          setHostWord={setHostWord}
          allImposterEnabled={allImposterEnabled}
          setAllImposterEnabled={setAllImposterEnabled}
          allImposterFreq={allImposterFreq}
          setAllImposterFreq={setAllImposterFreq}
          onStart={handleStart}
          onOnline={() => setMode('online')}
          ot={onlineText(lang)}
        />
      )}

      {screen === 'custom' && (
        <Custom t={t} onBack={() => setScreen('setup')} onContinue={(w, h) => newRound(w, h)} />
      )}

      {screen === 'reveal' && game && (
        <Reveal
          t={t}
          lang={lang}
          key={revealIndex}
          name={resolvedNames()[revealIndex]}
          index={revealIndex}
          total={playerCount}
          isImposter={game.imposters.has(revealIndex)}
          word={word}
          hint={hint}
          onNext={nextReveal}
        />
      )}

      {screen === 'start' && game && (
        <StartRound
          t={t}
          starter={resolvedNames()[game.startIndex]}
          onReveal={() => setScreen('result')}
          onNew={() => setScreen('setup')}
        />
      )}

      {screen === 'result' && game && (
        <Result
          t={t}
          imposterNames={resolvedNames().filter((_, i) => game.imposters.has(i))}
          word={word}
          allImposter={game.allImposter}
          onAgain={playAgain}
          onNew={() => setScreen('setup')}
        />
      )}
    </div>
  )
}

function Setup({ t, ot, lang, setLang, playerCount, setCount, imposterCount, setImposterCount, names, setName, hostWord, setHostWord, allImposterEnabled, setAllImposterEnabled, allImposterFreq, setAllImposterFreq, onStart, onOnline }) {
  const imposterTooMany = imposterCount >= playerCount
  const resolved = names.map((n, i) => (n.trim() ? n.trim() : `${t.playerName} ${i + 1}`).toLowerCase())
  const hasDup = new Set(resolved).size !== resolved.length
  const blocked = imposterTooMany || hasDup
  return (
    <div className="screen setup">
      <header className="brand">
        <h1 className="logo">{t.title}</h1>
        <p className="tagline">{t.subtitle}</p>
      </header>

      <div className="lang-pills">
        {LANGS.map((l) => (
          <button
            key={l.code}
            className={`pill ${lang === l.code ? 'active' : ''}`}
            onClick={() => setLang(l.code)}
          >
            <span className="flag">{l.flag}</span> {l.label}
          </button>
        ))}
      </div>

      <div className="card-block">
        <Stepper label={t.playerCount} value={playerCount} onChange={setCount} min={MIN_PLAYERS} max={MAX_PLAYERS} />
        <Stepper label={t.imposterCount} value={imposterCount} onChange={(v) => setImposterCount(Math.max(1, Math.min(playerCount - 1, v)))} min={1} max={playerCount - 1} />
        {imposterTooMany && <p className="error">{t.imposterError}</p>}
      </div>

      <div className="names">
        <h3 className="section-title">{t.playerNames}</h3>
        {names.map((n, i) => (
          <div className="name-row" key={i}>
            <span className="num">{i + 1}</span>
            <input
              value={n}
              maxLength={16}
              placeholder={`${t.playerName} ${i + 1}`}
              onChange={(e) => setName(i, e.target.value)}
            />
          </div>
        ))}
        {hasDup && <p className="error">{t.dupError}</p>}
      </div>

      <div className="special">
        <h3 className="section-title">{t.specialModes}</h3>
        <div className="card-block toggles">
          <Toggle label={t.hostWordToggle} desc={t.hostWordDesc} checked={hostWord} onChange={setHostWord} />
          <Toggle label={t.allImposterToggle} desc={t.allImposterDesc} checked={allImposterEnabled} onChange={setAllImposterEnabled} />
          {allImposterEnabled && (
            <Stepper label={t.freqLabel} value={allImposterFreq} onChange={(v) => setAllImposterFreq(Math.max(2, Math.min(50, v)))} min={2} max={50} />
          )}
        </div>
      </div>

      <button className="primary big" onClick={onStart} disabled={blocked}>
        {t.start}
      </button>
      <button className="ghost" onClick={onOnline}>
        {ot.onlineRoom}
      </button>
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <button className={`toggle-row ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="toggle-text">
        <span className="toggle-label">{label}</span>
        <span className="toggle-desc">{desc}</span>
      </span>
      <span className="switch"><span className="knob" /></span>
    </button>
  )
}

function Custom({ t, onBack, onContinue }) {
  const [w, setW] = useState('')
  const [h, setH] = useState('')
  const ready = w.trim() && h.trim()
  return (
    <div className="screen custom">
      <button className="back-link" onClick={onBack}>{t.back}</button>
      <header className="brand">
        <h1 className="logo small">{t.customTitle}</h1>
      </header>
      <p className="host-note">{t.hostNote}</p>
      <div className="custom-fields">
        <label className="field">
          <span className="field-label">{t.customWordLabel}</span>
          <input value={w} maxLength={28} placeholder={t.customWordPh} onChange={(e) => setW(e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span className="field-label">{t.customHintLabel}</span>
          <input value={h} maxLength={28} placeholder={t.customHintPh} onChange={(e) => setH(e.target.value)} />
        </label>
      </div>
      <button className="primary big" disabled={!ready} onClick={() => onContinue(w.trim(), h.trim())}>
        {t.continue}
      </button>
    </div>
  )
}

function Stepper({ label, value, onChange, min, max }) {
  return (
    <div className="stepper">
      <span className="stepper-label">{label}</span>
      <div className="stepper-controls">
        <button onClick={() => onChange(value - 1)} disabled={value <= min}>−</button>
        <span className="stepper-value">{value}</span>
        <button onClick={() => onChange(value + 1)} disabled={value >= max}>+</button>
      </div>
    </div>
  )
}

function Reveal({ t, name, index, total, isImposter, word, hint, onNext }) {
  const [dragY, setDragY] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [peeked, setPeeked] = useState(false)
  const startY = useRef(0)
  const cardRef = useRef(null)

  function onDown(e) {
    setDragging(true)
    startY.current = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  function onMove(e) {
    if (!dragging) return
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    const dy = y - startY.current
    if (dy < 0) {
      // The cover can only be pulled up to half the card — never fully off.
      const maxPull = (cardRef.current?.clientHeight ?? 440) / 2
      const d = Math.max(dy, -maxPull)
      setDragY(d)
      if (d < -maxPull * 0.5) setPeeked(true)
    }
  }
  function onUp() {
    // Always snap the cover back so nobody else can see the card.
    setDragging(false)
    setDragY(0)
  }

  return (
    <div className="screen reveal">
      <div className="pass-head">
        <span className="counter">{index + 1} / {total}</span>
        <p className="pass-label">{t.passTo}</p>
        <h2 className="pass-name">{t.playerName} {index + 1}</h2>
      </div>

      <div className="card-stage">
        <div className="reveal-card" ref={cardRef}>
          <div className="card-content">
            {isImposter ? (
              <>
                <span className="card-kicker">{t.yourHint}</span>
                <span className="card-word">{hint}</span>
                <span className="imposter-tag">{t.imposter}</span>
              </>
            ) : (
              <>
                <span className="card-kicker">{t.yourWord}</span>
                <span className="card-word">{word}</span>
              </>
            )}
          </div>

          <div
            className={`cover ${dragging ? 'dragging' : ''}`}
            style={{ transform: `translateY(${dragY}px)` }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <span className="cover-name">{name}</span>
            <div className="cover-arrow">⬆</div>
            <p className="cover-title">{t.pullToReveal}</p>
            <p className="cover-sub">{t.tapHint}</p>
          </div>
        </div>
      </div>

      <button className="primary big" disabled={!peeked} onClick={onNext}>
        {index + 1 < total ? t.nextPlayer : t.showStart}
      </button>
    </div>
  )
}

function StartRound({ t, starter, onReveal, onNew }) {
  return (
    <div className="screen start">
      <div className="start-inner">
        <p className="ready">{t.ready}</p>
        <div className="starter-card">
          <span className="starter-name">{starter}</span>
          <span className="starter-sub">{t.startsFirst}</span>
        </div>
        <p className="discuss">{t.beginDiscussion}</p>
      </div>
      <div className="btn-stack">
        <button className="primary big" onClick={onReveal}>{t.revealResult}</button>
        <button className="ghost" onClick={onNew}>{t.newGame}</button>
      </div>
    </div>
  )
}

function Result({ t, imposterNames, word, allImposter, onAgain, onNew }) {
  const label = imposterNames.length > 1 ? t.theImpostersPlural : t.theImposters
  return (
    <div className="screen result">
      <div className="result-inner">
        {allImposter && <p className="twist-banner">🎭 {t.allImposterReveal}</p>}
        <div className="result-block">
          <span className="result-label">{label}</span>
          <div className="imposter-list">
            {imposterNames.map((n, i) => (
              <span className="imposter-chip" key={i}>{n}</span>
            ))}
          </div>
        </div>
        <div className="result-block">
          <span className="result-label">{t.theWord}</span>
          <span className="result-word">{word}</span>
        </div>
      </div>
      <div className="btn-stack">
        <button className="primary big" onClick={onAgain}>{t.playAgain}</button>
        <button className="ghost" onClick={onNew}>{t.newGame}</button>
      </div>
    </div>
  )
}

async function api(path, payload) {
  const options = payload
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
    : undefined
  const res = await fetch(path, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

function OnlineRoom({ lang, setLang, onBack }) {
  const ot = onlineText(lang)
  const [name, setName] = useState(localStorage.getItem('imposter-name') || '')
  const [joinCode, setJoinCode] = useState('')
  const [playerId, setPlayerId] = useState(localStorage.getItem('imposter-player-id') || '')
  const [room, setRoom] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!room?.code || !playerId) return undefined
    const events = new EventSource(`/api/rooms/${room.code}/events?playerId=${playerId}`)
    events.addEventListener('room', (event) => setRoom(JSON.parse(event.data)))
    events.addEventListener('signal', (event) => {
      window.dispatchEvent(new CustomEvent('imposter-voice-signal', { detail: JSON.parse(event.data) }))
    })
    events.onerror = () => setError(ot.liveReconnect)
    return () => events.close()
  }, [room?.code, playerId])

  async function createRoom() {
    setError('')
    const result = await api('/api/rooms', { name: name || ot.playerName })
    localStorage.setItem('imposter-name', name || ot.playerName)
    localStorage.setItem('imposter-player-id', result.playerId)
    setPlayerId(result.playerId)
    setRoom(result.room)
  }

  async function joinRoom() {
    setError('')
    const code = joinCode.trim().toUpperCase()
    const result = await api(`/api/rooms/${code}/join`, { name: name || ot.playerName, playerId })
    localStorage.setItem('imposter-name', name || ot.playerName)
    localStorage.setItem('imposter-player-id', result.playerId)
    setPlayerId(result.playerId)
    setRoom(result.room)
  }

  async function action(payload) {
    if (!room || !playerId) return
    const result = await api(`/api/rooms/${room.code}/action`, { ...payload, playerId })
    if (result.left) {
      setRoom(null)
      return
    }
    setRoom(result.room)
  }

  function leaveRoom() {
    if (room && playerId) void action({ type: 'leave' })
    else setRoom(null)
  }

  function canSwitchGame() {
    const status = room?.state?.status
    if (!status) return true
    if (room.gameType === 'imposter') return status === 'setup' || status === 'result'
    if (room.gameType === 'number') return status === 'setup' || status === 'finished'
    if (room.gameType === 'planes') return status === 'placement' || status === 'finished'
    return true
  }

  if (!room) {
    return (
      <div className="app">
        <div className="screen setup">
          <button className="back-link" onClick={onBack}>{ot.back}</button>
          <header className="brand">
            <h1 className="logo small">{ot.createTitle}</h1>
            <p className="tagline">{ot.createSubtitle}</p>
          </header>
          <div className="lang-pills">
            {LANGS.map((l) => (
              <button key={l.code} className={`pill ${lang === l.code ? 'active' : ''}`} onClick={() => setLang(l.code)}>
                <span className="flag">{l.flag}</span> {l.label}
              </button>
            ))}
          </div>
          <label className="field">
            <span className="field-label">{ot.yourName}</span>
            <input value={name} maxLength={24} placeholder={ot.playerName} onChange={(e) => setName(e.target.value)} />
          </label>
          <button className="primary big" onClick={() => void createRoom()}>{ot.createRoom}</button>
          <div className="online-form">
            <label className="field">
              <span className="field-label">{ot.roomCode}</span>
              <input value={joinCode} maxLength={8} placeholder="ABC123" onChange={(e) => setJoinCode(e.target.value)} />
            </label>
            <button className="ghost" disabled={!joinCode.trim()} onClick={() => void joinRoom()}>{ot.joinRoom}</button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
    )
  }

  const isHost = room.hostId === playerId
  return (
    <div className="app online-app">
      <div className="screen setup">
        <button className="back-link" onClick={leaveRoom}>{ot.leaveRoom}</button>
        <div className="room-head">
          <span className="room-code">{room.code}</span>
          <button className="mini-btn" onClick={() => navigator.clipboard?.writeText(room.code)}>{ot.copy}</button>
        </div>
        <div className="player-strip">
          {room.players.map((player) => (
            <span key={player.id} className={`player-chip ${player.id === playerId ? 'me' : ''}`}>{player.name}</span>
          ))}
        </div>
        {isHost && (
          <div className="game-tabs">
            <button disabled={!canSwitchGame() && room.gameType !== 'imposter'} className={room.gameType === 'imposter' ? 'active' : ''} onClick={() => void action({ type: 'selectGame', gameType: 'imposter' })}>{ot.imposterGame}</button>
            <button disabled={!canSwitchGame() && room.gameType !== 'planes'} className={room.gameType === 'planes' ? 'active' : ''} onClick={() => void action({ type: 'selectGame', gameType: 'planes' })}>{ot.planesGame}</button>
            <button disabled={!canSwitchGame() && room.gameType !== 'number'} className={room.gameType === 'number' ? 'active' : ''} onClick={() => void action({ type: 'selectGame', gameType: 'number' })}>{ot.numberGame}</button>
          </div>
        )}
        {room.gameType === 'imposter' && <OnlineImposter room={room} playerId={playerId} lang={lang} action={action} ot={ot} />}
        {room.gameType === 'number' && <OnlineNumber room={room} playerId={playerId} action={action} ot={ot} />}
        {room.gameType === 'planes' && <OnlinePlanes room={room} playerId={playerId} action={action} ot={ot} />}
        {error && <p className="error">{error}</p>}
        <VoiceChat room={room} playerId={playerId} action={action} ot={ot} />
      </div>
    </div>
  )
}

function VoiceChat({ room, playerId, action, ot }) {
  const [enabled, setEnabled] = useState(false)
  const [muted, setMuted] = useState(false)
  const [status, setStatus] = useState(ot.voiceOff)
  const streamRef = useRef(null)
  const peersRef = useRef(new Map())
  const makingOfferRef = useRef(new Set())

  useEffect(() => {
    if (!enabled) return undefined
    let disposed = false

    async function ensureStream() {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      }
      return streamRef.current
    }

    async function makePeer(peerId, polite) {
      if (peersRef.current.has(peerId)) return peersRef.current.get(peerId)
      const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
      peersRef.current.set(peerId, pc)
      const stream = await ensureStream()
      for (const track of stream.getTracks()) pc.addTrack(track, stream)
      pc.onicecandidate = (event) => {
        if (event.candidate) void action({ type: 'signal', targetId: peerId, signal: { candidate: event.candidate } })
      }
      pc.ontrack = (event) => {
        let audio = document.getElementById(`voice-${peerId}`)
        if (!audio) {
          audio = document.createElement('audio')
          audio.id = `voice-${peerId}`
          audio.autoplay = true
          document.body.appendChild(audio)
        }
        audio.srcObject = event.streams[0]
      }
      pc.onconnectionstatechange = () => setStatus(`${ot.voiceConnecting}: ${pc.connectionState}`)
      pc._polite = polite
      return pc
    }

    async function connectTo(peerId) {
      const pc = await makePeer(peerId, playerId > peerId)
      if (makingOfferRef.current.has(peerId) || pc.signalingState !== 'stable') return
      makingOfferRef.current.add(peerId)
      try {
        await pc.setLocalDescription(await pc.createOffer())
        await action({ type: 'signal', targetId: peerId, signal: { description: pc.localDescription } })
      } finally {
        makingOfferRef.current.delete(peerId)
      }
    }

    async function onSignal(event) {
      const { fromId, signal } = event.detail
      if (!fromId || fromId === playerId || disposed) return
      const pc = await makePeer(fromId, playerId > fromId)
      try {
        if (signal.description) {
          const offerCollision = signal.description.type === 'offer' && (makingOfferRef.current.has(fromId) || pc.signalingState !== 'stable')
          if (offerCollision && !pc._polite) return
          await pc.setRemoteDescription(signal.description)
          if (signal.description.type === 'offer') {
            await pc.setLocalDescription(await pc.createAnswer())
            await action({ type: 'signal', targetId: fromId, signal: { description: pc.localDescription } })
          }
        } else if (signal.candidate) {
          await pc.addIceCandidate(signal.candidate)
        }
      } catch {
        setStatus(ot.voiceReconnect)
      }
    }

    window.addEventListener('imposter-voice-signal', onSignal)
    ensureStream()
      .then(() => Promise.all(room.players.filter((p) => p.id !== playerId).map((p) => connectTo(p.id))))
      .then(() => !disposed && setStatus(ot.voiceOn))
      .catch(() => !disposed && setStatus(ot.voiceMicNeeded))

    return () => {
      disposed = true
      window.removeEventListener('imposter-voice-signal', onSignal)
      for (const pc of peersRef.current.values()) pc.close()
      peersRef.current.clear()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [enabled, room.players, playerId])

  function toggleMute() {
    const next = !muted
    setMuted(next)
    streamRef.current?.getAudioTracks().forEach((track) => { track.enabled = !next })
  }

  return (
    <div className="voice-bar">
      <span>{status}</span>
      <div>
        <button className="mini-btn" onClick={() => setEnabled((value) => !value)}>{enabled ? ot.stopVoice : ot.startVoice}</button>
        <button className="mini-btn" disabled={!enabled} onClick={toggleMute}>{muted ? ot.unmute : ot.mute}</button>
      </div>
    </div>
  )
}

function OnlineImposter({ room, playerId, lang, action, ot }) {
  const [imposterCount, setImposterCount] = useState(1)
  const [targetId, setTargetId] = useState('')
  const state = room.state || {}
  const me = state.me
  const isHost = room.hostId === playerId

  function startRound() {
    const entry = WORDS[nextWordIndex()]
    const count = Math.max(1, Math.min(imposterCount, room.players.length - 1))
    const imposters = new Set()
    while (imposters.size < count) imposters.add(room.players[Math.floor(Math.random() * room.players.length)].id)
    const assignments = {}
    for (const player of room.players) {
      assignments[player.id] = {
        role: imposters.has(player.id) ? 'imposter' : 'crew',
        word: entry.word[lang],
        hint: entry.hint[lang],
      }
    }
    const starterId = room.players[Math.floor(Math.random() * room.players.length)].id
    void action({ type: 'startImposter', word: entry.word[lang], hint: entry.hint[lang], assignments, imposterIds: [...imposters], starterId })
  }

  if (state.status === 'setup') {
    return (
      <div className="online-panel">
        <h2>{ot.imposterGame}</h2>
        {isHost ? (
          <>
            <Stepper label={ot.imposters} value={imposterCount} min={1} max={Math.max(1, room.players.length - 1)} onChange={setImposterCount} />
            <button className="primary big" disabled={room.players.length < 3} onClick={startRound}>{ot.startOnlineRound}</button>
          </>
        ) : <p className="host-note">{ot.waitingHost}</p>}
      </div>
    )
  }

  const votes = state.votes || {}
  const starter = room.players.find((player) => player.id === state.starterId)?.name
  return (
    <div className="online-panel">
      <h2>{ot.yourCard}</h2>
      <div className="secret-card">
        <span className="card-kicker">{me?.role === 'imposter' ? ot.hint : ot.secretWord}</span>
        <span className="card-word">{me?.role === 'imposter' ? me.hint : me?.word}</span>
        {me?.role === 'imposter' && <span className="imposter-tag">IMPOSTER</span>}
      </div>
      <p className="host-note">{starter || ot.someone} {ot.starts}</p>
      <div className="vote-grid">
        {room.players.map((player) => (
          <button key={player.id} className={targetId === player.id ? 'active' : ''} onClick={() => setTargetId(player.id)}>{player.name}</button>
        ))}
      </div>
      <button className="primary big" disabled={!targetId || votes[playerId]} onClick={() => void action({ type: 'vote', targetId })}>
        {votes[playerId] ? ot.voteSent : ot.vote}
      </button>
      {isHost && <button className="ghost" onClick={() => void action({ type: 'reveal' })}>{ot.revealNow}</button>}
      {state.status === 'result' && <ImposterVoteResult room={room} state={state} action={action} isHost={isHost} ot={ot} />}
    </div>
  )
}

function ImposterVoteResult({ room, state, action, isHost, ot }) {
  const counts = {}
  for (const vote of Object.values(state.votes || {})) counts[vote] = (counts[vote] || 0) + 1
  const imposters = room.players.filter((player) => state.imposterIds?.includes(player.id)).map((player) => player.name)
  return (
    <div className="result-block">
      <span className="result-label">{ot.votes}</span>
      {room.players.map((player) => <span key={player.id}>{player.name}: {counts[player.id] || 0}</span>)}
      <span className="result-label">Imposter</span>
      <span>{imposters.join(', ') || ot.hidden}</span>
      <span className="result-word">{state.word}</span>
      {isHost && <button className="ghost" onClick={() => void action({ type: 'reset' })}>{ot.newRound}</button>}
    </div>
  )
}

function OnlineNumber({ room, playerId, action, ot }) {
  const [secret, setSecret] = useState('')
  const [guess, setGuess] = useState('')
  const [targetId, setTargetId] = useState('')
  const state = room.state || {}
  const myTurn = state.turnId === playerId
  const targets = room.players.filter((player) => player.id !== playerId && state.ready?.[player.id])
  const activeTargetId = targetId || targets[0]?.id || ''
  const clean = (value) => value.replace(/\D/g, '').slice(0, 4)
  return (
    <div className="online-panel">
      <h2>{ot.numberGame}</h2>
      {state.status === 'setup' ? (
        <>
          <label className="field">
            <span className="field-label">{ot.yourSecretNumber}</span>
            <input inputMode="numeric" value={secret} onChange={(e) => setSecret(clean(e.target.value))} />
          </label>
          <button className="primary big" disabled={secret.length !== 4} onClick={() => void action({ type: 'setSecret', code: secret })}>{ot.ready}</button>
          <div className="player-strip">
            {room.players.map((player) => <span className="player-chip" key={player.id}>{player.name}: {state.ready?.[player.id] ? ot.ready : ot.waiting}</span>)}
          </div>
        </>
      ) : (
        <>
          <p className="host-note">{state.status === 'finished' ? `${room.players.find((p) => p.id === state.winnerId)?.name} ${ot.won}` : myTurn ? ot.yourTurn : ot.waitingTurn}</p>
          <h3 className="section-title">{ot.target}</h3>
          <div className="vote-grid">
            {targets.map((player) => (
              <button key={player.id} className={activeTargetId === player.id ? 'active' : ''} onClick={() => setTargetId(player.id)}>{player.name}</button>
            ))}
          </div>
          <label className="field">
            <span className="field-label">{ot.guess}</span>
            <input inputMode="numeric" value={guess} onChange={(e) => setGuess(clean(e.target.value))} />
          </label>
          <button className="primary big" disabled={!myTurn || !activeTargetId || guess.length !== 4 || state.status !== 'playing'} onClick={() => { void action({ type: 'guess', code: guess, targetId: activeTargetId }); setGuess('') }}>{ot.guess}</button>
          <AttemptList attempts={state.attempts || []} players={room.players} />
          <button className="ghost" onClick={() => void action({ type: 'reset' })}>{ot.reset}</button>
        </>
      )}
    </div>
  )
}

function AttemptList({ attempts, players }) {
  return (
    <div className="attempts">
      {attempts.slice().reverse().map((attempt) => (
        <div key={attempt.id} className="attempt-row">
          <span>{players.find((p) => p.id === attempt.playerId)?.name}</span>
          <b>{attempt.guess}</b>
          <span>{attempt.alpha}A / {attempt.betta}B</span>
        </div>
      ))}
    </div>
  )
}

const BASE_PLANE = [
  { x: 1, y: 0 },
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
  { x: 1, y: 2 },
  { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
]

function planeCells(plane) {
  return rotatePlaneCells(plane.rotation || 0).map((cell) => ({ x: plane.x + cell.x, y: plane.y + cell.y }))
}

function planeStats(players, state) {
  const count = state.planeCount || 1
  const shots = state.shots || []
  return players.map((player) => {
    const dead = new Set()
    const damaged = new Set()
    for (const shot of shots) {
      if (shot.targetId !== player.id || shot.planeIndex == null) continue
      if (shot.result === 'head') dead.add(shot.planeIndex)
      if (shot.result === 'hit') damaged.add(shot.planeIndex)
    }
    for (const index of dead) damaged.delete(index)
    return {
      player,
      alive: Math.max(0, count - dead.size),
      damaged: damaged.size,
      dead: dead.size,
      eliminated: Boolean(state.eliminated?.[player.id]),
    }
  })
}

function rotatePlaneCells(rotation) {
  let cells = BASE_PLANE.map((cell) => ({ ...cell }))
  for (let angle = 0; angle < rotation; angle += 90) {
    cells = cells.map(({ x, y }) => ({ x: -y, y: x }))
    const minX = Math.min(...cells.map((cell) => cell.x))
    const minY = Math.min(...cells.map((cell) => cell.y))
    cells = cells.map(({ x, y }) => ({ x: x - minX, y: y - minY }))
  }
  return cells
}

function OnlinePlanes({ room, playerId, action, ot }) {
  const [rotation, setRotation] = useState(0)
  const [selectedPlaneIndex, setSelectedPlaneIndex] = useState(0)
  const [targetId, setTargetId] = useState('')
  const [proposedCount, setProposedCount] = useState(1)
  const state = room.state || {}
  const myTurn = state.turnId === playerId
  const planeCount = state.planeCount || 1
  const myPlanes = state.planes?.[playerId] || []
  const targets = room.players.filter((player) => player.id !== playerId && !state.eliminated?.[player.id])
  const activeTargetId = targetId || targets[0]?.id || ''
  const myShots = (state.shots || []).filter((shot) => shot.playerId === playerId && shot.targetId === activeTargetId)
  const incoming = (state.shots || []).filter((shot) => shot.targetId === playerId)
  const proposal = state.planeProposal
  const proposer = room.players.find((player) => player.id === proposal?.proposedBy)
  const proposalApproved = Boolean(proposal?.approvals?.includes(playerId))
  const isHost = room.hostId === playerId
  const stats = planeStats(room.players, state)
  return (
    <div className="online-panel">
      <h2>{ot.planesGame}</h2>
      <PlaneStatusStrip stats={stats} playerId={playerId} ot={ot} />
      {state.status === 'placement' ? (
        <>
          <div className="control-band">
            <Stepper label={ot.planeCount} value={proposedCount} min={1} max={5} onChange={setProposedCount} />
            {isHost && <button className="ghost" disabled={proposedCount === planeCount} onClick={() => void action({ type: 'proposePlaneCount', count: proposedCount })}>{ot.propose}</button>}
            {proposal && (
              <div className="proposal-line">
                {proposal.proposedBy === playerId ? `${proposal.count}: ${ot.proposalWaiting}` : `${proposer?.name || ''} ${proposal.count} - ${ot.proposalIncoming}`}
                {proposal.proposedBy === playerId
                  ? <button className="ghost" onClick={() => void action({ type: 'cancelPlaneProposal' })}>{ot.cancel}</button>
                  : <button className="ghost" disabled={proposalApproved} onClick={() => void action({ type: 'approvePlaneCount' })}>{proposalApproved ? ot.ready : ot.approve}</button>}
              </div>
            )}
          </div>
          <p className="host-note">{ot.placePlane}</p>
          <div className="player-strip">
            {Array.from({ length: planeCount }, (_, index) => (
              <button key={index} className={`player-chip ${selectedPlaneIndex === index ? 'me' : ''}`} onClick={() => {
                setSelectedPlaneIndex(index)
                if (myPlanes[index]) setRotation(myPlanes[index].rotation || 0)
              }}>
                {ot.selectPlane} {index + 1}
              </button>
            ))}
          </div>
          <BattleGrid planes={myPlanes} shots={incoming} onCell={(cell) => void action({ type: 'placePlane', ...cell, rotation, index: selectedPlaneIndex })} />
          <div className="mini-plane-wrap">
            <span>{ot.placedPlanes}: {myPlanes.length}/{planeCount}</span>
            <MiniPlanePreview rotation={rotation} />
          </div>
          <div className="btn-stack">
            <button className="ghost" onClick={() => setRotation((rotation + 90) % 360)}>{ot.rotate} {rotation} deg</button>
            <button className="primary big" disabled={myPlanes.length < planeCount} onClick={() => void action({ type: 'ready' })}>{state.ready?.[playerId] ? ot.ready : ot.readyUp}</button>
          </div>
        </>
      ) : (
        <>
          <p className="host-note">{state.status === 'finished' ? `${room.players.find((p) => p.id === state.winnerId)?.name} ${ot.won}` : myTurn ? ot.yourTurnFire : ot.waitingTurn}</p>
          <h3 className="section-title">{ot.target}</h3>
          <div className="vote-grid">
            {targets.map((player) => (
              <button key={player.id} className={activeTargetId === player.id ? 'active' : ''} onClick={() => setTargetId(player.id)}>
                <TargetLabel stat={stats.find((item) => item.player.id === player.id)} ot={ot} />
              </button>
            ))}
          </div>
          <BattleGrid shots={myShots} onCell={(cell) => myTurn && activeTargetId && void action({ type: 'fire', ...cell, targetId: activeTargetId })} />
          <h3 className="section-title">{ot.yourBoard}</h3>
          <BattleGrid planes={myPlanes} shots={incoming} />
          <button className="ghost" onClick={() => void action({ type: 'reset' })}>{ot.reset}</button>
        </>
      )}
    </div>
  )
}

function PlaneStatusStrip({ stats, playerId, ot }) {
  return (
    <div className="plane-status-strip">
      {stats.map((stat) => (
        <div key={stat.player.id} className={`plane-status ${stat.player.id === playerId ? 'me' : ''} ${stat.eliminated ? 'out' : ''}`}>
          <span className="plane-status-name">{stat.player.name}</span>
          <span className="plane-status-row"><span className="plane-glyph alive" />{ot.alivePlanes}: {stat.alive}</span>
          <span className="plane-status-row"><span className="plane-glyph damaged" />{ot.damagedPlanes}: {stat.damaged}</span>
          <span className="plane-status-row"><span className="plane-glyph dead" />{ot.deadPlanes}: {stat.dead}</span>
        </div>
      ))}
    </div>
  )
}

function TargetLabel({ stat, ot }) {
  if (!stat) return null
  return (
    <span className="target-label">
      <span className="target-name">{stat.player.name}</span>
      <span className="target-stats">
        <span><span className="plane-glyph alive" />{stat.alive}</span>
        <span><span className="plane-glyph damaged" />{stat.damaged}</span>
        <span><span className="plane-glyph dead" />{stat.dead}</span>
      </span>
      {stat.eliminated && <span className="target-out">{ot.eliminated}</span>}
    </span>
  )
}

function MiniPlanePreview({ rotation }) {
  const cells = rotatePlaneCells(rotation)
  return (
    <div className="mini-plane">
      {Array.from({ length: 16 }, (_, i) => {
        const x = i % 4
        const y = Math.floor(i / 4)
        const filled = cells.some((cell) => cell.x === x && cell.y === y)
        const head = cells[0]?.x === x && cells[0]?.y === y
        return <span key={i} className={`${filled ? 'on' : ''} ${head ? 'head' : ''}`} />
      })}
    </div>
  )
}

function BattleGrid({ planes = [], plane, shots = [], onCell }) {
  const allPlanes = plane ? [plane] : planes
  const cells = allPlanes.flatMap((item, planeIndex) => planeCells(item).map((cell, cellIndex) => ({ ...cell, planeIndex, head: cellIndex === 0 })))
  return (
    <div className="battle-grid">
      {Array.from({ length: 100 }, (_, i) => {
        const x = (i % 10) + 1
        const y = Math.floor(i / 10) + 1
        const shipCell = cells.find((cell) => cell.x === x && cell.y === y)
        const ship = Boolean(shipCell)
        const shot = shots.find((item) => item.x === x && item.y === y)
        return (
          <button key={`${x}:${y}`} className={`${ship ? 'ship' : ''} ${shipCell?.head ? 'ship-head' : ''} ${shot?.result || ''}`} onClick={() => onCell?.({ x, y })}>
            {shot ? (shot.result === 'miss' ? 'o' : 'x') : shipCell?.head ? '●' : ship ? '+' : ''}
          </button>
        )
      })}
    </div>
  )
}
