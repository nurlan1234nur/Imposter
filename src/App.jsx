import { useState, useRef } from 'react'
import { LANGS, STRINGS } from './i18n.js'
import { WORDS, nextWordIndex } from './words.js'

const MIN_PLAYERS = 3
const MAX_PLAYERS = 12

export default function App() {
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

function Setup({ t, lang, setLang, playerCount, setCount, imposterCount, setImposterCount, names, setName, hostWord, setHostWord, allImposterEnabled, setAllImposterEnabled, allImposterFreq, setAllImposterFreq, onStart }) {
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
