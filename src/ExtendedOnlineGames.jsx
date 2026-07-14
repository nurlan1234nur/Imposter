import { useEffect, useMemo, useState } from 'react'

export const GAME_CATALOG = [
  { id: 'offline-imposter', icon: '📱', name: 'Imposter Offline', players: '3–12', time: '10–30 мин', difficulty: 'Хялбар', from: '#172554', to: '#312e81', color: '#818cf8', description: 'Нэг утсаа дамжуулж, хүн бүр нууц үг эсвэл Imposter дүрээ хараад нүүр нүүрээ харж тоглоно.', offline: true },
  { id: 'imposter', icon: '👾', name: 'Imposter', players: '3–12', time: '15–30 мин', difficulty: 'Хялбар', from: '#1e1b4b', to: '#3730a3', color: '#6366f1', description: 'Нууц үгээр imposter-ийг ол — эсвэл баригдалгүй үлд.' },
  { id: 'mafia', icon: '🎭', name: 'Мафиа', players: '5–12', time: '20–40 мин', difficulty: 'Дунд', from: '#450a0a', to: '#7f1d1d', color: '#ef4444', description: 'Шөнийн нууц дүрүүд, өдрийн сэжиг ба санал хураалт.' },
  { id: 'avalon', icon: '⚔️', name: 'Avalon', players: '5–10', time: '30–60 мин', difficulty: 'Хэцүү', from: '#0c2340', to: '#0369a1', color: '#0ea5e9', description: 'Артурын шүүх дэх сайн ба муугийн нууц тулаан.' },
  { id: 'hitler', icon: '🗳️', name: 'Secret Hitler', players: '5–10', time: '30–60 мин', difficulty: 'Хэцүү', from: '#1a0533', to: '#4c1d95', color: '#7c3aed', description: 'Сонгууль, бодлого, улс төрийн нуугдмал тулаан.' },
  { id: 'wink', icon: '👁️', name: 'Wink Murder', players: '6+', time: '10–20 мин', difficulty: 'Хялбар', from: '#022c22', to: '#065f46', color: '#10b981', description: 'Нууц алуурчныг гурван таалтаас өмнө илрүүл.' },
  { id: 'twoRooms', icon: '💣', name: 'Two Rooms', players: '10+', time: '15–30 мин', difficulty: 'Дунд', from: '#292100', to: '#78350f', color: '#f59e0b', description: 'Хоёр өрөө, барьцааны солилцоо, нэг нууц бөмбөг.' },
  { id: 'bang', icon: '🤠', name: 'Bang!', players: '4–7', time: '30–60 мин', difficulty: 'Дунд', from: '#2c0f00', to: '#7c2d12', color: '#f97316', description: 'Зэрлэг барууны нууц дүртэй картын буудалцаан.' },
  { id: 'planes', icon: '✈️', name: 'Онгоц', players: '2+', time: '15–30 мин', difficulty: 'Дунд', from: '#082f49', to: '#155e75', color: '#06b6d4', description: 'Онгоцоо байрлуулж, өрсөлдөгчийн толгойг олж бууд.' },
  { id: 'number', icon: '🔢', name: 'Тоо олох', players: '2+', time: '10–20 мин', difficulty: 'Хялбар', from: '#052e16', to: '#166534', color: '#22c55e', description: 'Нууц дөрвөн оронтой тоог логикоор түрүүлж ол.' },
]

const TEXT = {
  en: {
    chooseGame: 'Choose a game', changeGame: 'Change game', createThis: 'Create this room', cancel: 'Cancel', setup: 'Game settings', setupHint: 'ROOM SETUP',
    hostOnly: 'Waiting for the host.', need: 'Required players', start: 'Start game', reset: 'Play again',
    yourRole: 'Your role', known: 'You know', good: 'Good', evil: 'Evil', liberal: 'Liberals', fascist: 'Fascists',
    merlin: 'Merlin', percival: 'Percival', morgana: 'Morgana', mordred: 'Mordred', oberon: 'Oberon', assassin: 'Assassin', minion: 'Minion of Mordred', loyal: 'Loyal servant', hitler: 'Hitler',
    winner: 'Winner', select: 'Select', approve: 'Approve', reject: 'Reject', success: 'Success', fail: 'Fail',
    leader: 'Leader', mission: 'Mission', proposeTeam: 'Propose team', waitingVotes: 'Waiting for votes', assassinate: 'Assassinate Merlin', teamSize: 'Mission team', rejectTrack: 'Rejected teams', missionFourRule: 'Mission 4 needs 2 Fail cards.', chooseExact: 'Choose exactly', teamProposal: 'Proposed mission team', missionVote: 'Mission cards received',
    nominate: 'Nominate Chancellor', ja: 'JA!', nein: 'NEIN!', discard: 'Discard', enact: 'Enact', execute: 'Execute', electPresident: 'Elect a President', votePresident: 'Vote for President', presidentVoteHelp: 'Choose who should become President.', waitingPresident: 'Waiting for the President election', waitingChancellor: 'Waiting for the President to nominate a Chancellor', votesReceived: 'Votes received',
    policyL: 'Liberal policy', policyF: 'Fascist policy', election: 'Election tracker', president: 'President', chancellor: 'Chancellor', investigateParty: 'Investigate party', chooseNextPresident: 'Choose special President', peekPolicies: 'Top three policies', continueGame: 'Continue game', investigationResult: 'Investigation result',
    murderer: 'Murderer', detective: 'Detective', bystander: 'Bystander', kill: 'Secretly kill', guess: 'Accuse murderer', nextKill: 'Allow next kill', guesses: 'Guesses left',
    presidentRole: 'President', bomber: 'Bomber', member: 'Team member', blue: 'Blue', red: 'Red', room: 'Room', round: 'Round', shareColor: 'Share color', shareRole: 'Share full role', sendHostages: 'Exchange hostages',
    sheriff: 'Sheriff', deputy: 'Deputy', outlaw: 'Outlaw', renegade: 'Renegade', hp: 'HP', turn: 'Turn', endTurn: 'End turn', use: 'Use', respondMissed: 'Use MISSED!', takeHit: 'Take hit', target: 'Target', hand: 'Your hand',
  },
  mn: {
    chooseGame: 'Тоглоом сонгох', changeGame: 'Тоглоом солих', createThis: 'Энэ тоглоомоор өрөө үүсгэх', cancel: 'Болих', setup: 'Тоглоомын тохиргоо', setupHint: 'ӨРӨӨНИЙ ТОХИРГОО',
    hostOnly: 'Host-ыг хүлээж байна.', need: 'Шаардлагатай тоглогч', start: 'Тоглоом эхлүүлэх', reset: 'Дахин тоглох',
    yourRole: 'Таны дүр', known: 'Таны мэдэх хүмүүс', good: 'Сайн тал', evil: 'Муу тал', liberal: 'Либералууд', fascist: 'Фашистууд',
    merlin: 'Мерлин', percival: 'Персиваль', morgana: 'Моргана', mordred: 'Мордред', oberon: 'Оберон', assassin: 'Ассасин', minion: 'Мордредийн хүн', loyal: 'Артурын үнэнч хүн', hitler: 'Гитлер',
    winner: 'Ялагч', select: 'Сонгох', approve: 'Дэмжинэ', reject: 'Дэмжихгүй', success: 'Амжилт', fail: 'Сүйтгэх',
    leader: 'Ахлагч', mission: 'Даалгавар', proposeTeam: 'Багийг санал болгох', waitingVotes: 'Саналуудыг хүлээж байна', assassinate: 'Мерлинийг устгах', teamSize: 'Mission баг', rejectTrack: 'Унасан багийн санал', missionFourRule: '4-р Mission-д 2 Fail хэрэгтэй.', chooseExact: 'Яг сонгох хүний тоо', teamProposal: 'Санал болгосон Mission баг', missionVote: 'Ирсэн Mission карт',
    nominate: 'Канцлер нэр дэвшүүлэх', ja: 'ДЭМЖИНЭ', nein: 'ДЭМЖИХГҮЙ', discard: 'Хаях', enact: 'Батлах', execute: 'Устгах', electPresident: 'Ерөнхийлөгч сонгох', votePresident: 'Ерөнхийлөгчид санал өгөх', presidentVoteHelp: 'Ерөнхийлөгч болгох хүнээ сонгоно уу.', waitingPresident: 'Ерөнхийлөгчийн санал хураалтыг хүлээж байна', waitingChancellor: 'Ерөнхийлөгч Канцлер нэр дэвшүүлэхийг хүлээж байна', votesReceived: 'Ирсэн санал',
    policyL: 'Либерал бодлого', policyF: 'Фашист бодлого', election: 'Сонгуулийн тоолуур', president: 'Ерөнхийлөгч', chancellor: 'Канцлер', investigateParty: 'Намыг шалгах', chooseNextPresident: 'Тусгай Ерөнхийлөгч сонгох', peekPolicies: 'Дээд 3 policy', continueGame: 'Тоглоом үргэлжлүүлэх', investigationResult: 'Шалгалтын хариу',
    murderer: 'Алуурчин', detective: 'Мөрдөгч', bystander: 'Энгийн хүн', kill: 'Нууцаар алах', guess: 'Алуурчныг таах', nextKill: 'Дараагийн аллагыг нээх', guesses: 'Таах эрх',
    presidentRole: 'Ерөнхийлөгч', bomber: 'Бөмбөгчин', member: 'Багийн гишүүн', blue: 'Цэнхэр', red: 'Улаан', room: 'Өрөө', round: 'Раунд', shareColor: 'Өнгөө харуулах', shareRole: 'Дүрээ бүтнээр харуулах', sendHostages: 'Барьцааны хүмүүсийг солих',
    sheriff: 'Шериф', deputy: 'Туслах', outlaw: 'Дээрэмчин', renegade: 'Урвагч', hp: 'Амь', turn: 'Ээлж', endTurn: 'Ээлж дуусгах', use: 'Ашиглах', respondMissed: 'MISSED! ашиглах', takeHit: 'Суманд оногдох', target: 'Бай', hand: 'Таны карт',
  },
  kk: {},
}

const tFor = (lang) => ({ ...TEXT.en, ...(TEXT[lang] || {}) })
const nameOf = (room, id) => room.players.find((player) => player.id === id)?.name || '—'

export function GameCatalog({ lang, selected, onSelect, compact = false, onlineOnly = false, games: suppliedGames, featured = false, hideTitle = false }) {
  const t = tFor(lang)
  const sourceGames = suppliedGames || GAME_CATALOG
  const games = onlineOnly ? sourceGames.filter((game) => !game.offline) : sourceGames
  return (
    <section className={`game-catalog ${compact ? 'compact' : ''} ${featured ? 'featured' : ''}`}>
      {!compact && !hideTitle && !featured && <h2>{t.chooseGame}</h2>}
      <div className="game-card-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className={`game-card ${selected === game.id ? 'active' : ''}`}
            style={{ '--game-from': game.from, '--game-to': game.to, '--game-color': game.color }}
            onClick={() => onSelect(game.id)}
          >
            <span className="game-card-main">
              <span className="game-icon">{game.icon}</span>
              <span className="game-card-copy"><strong>{game.name}</strong><span className="game-description">{game.description}</span></span>
              {game.offline && <span className="offline-badge">OFFLINE</span>}
            </span>
            <span className="game-card-meta"><small>👥 {game.players}</small><small>⏱ {game.time}</small><small className={`difficulty ${game.difficulty}`}>{game.difficulty}</small></span>
          </button>
        ))}
      </div>
    </section>
  )
}

function SetupGate({ room, playerId, min, max, onStart, children, t }) {
  const host = room.hostId === playerId
  const valid = room.players.length >= min && (!max || room.players.length <= max)
  return (
    <div className="extended-setup universal-game-setup">
      <div className="universal-setup-title"><span>⚙️</span><div><small>{t.setupHint}</small><h2>{t.setup}</h2></div></div>
      <section className="universal-setup-card">
        <div className="required-players"><span>{t.need}</span><strong>{min}{max ? `–${max}` : '+'}</strong></div>
        {host ? children : <p className="host-note">{t.hostOnly}</p>}
      </section>
      {host && <div className="universal-setup-footer"><button className="primary big" disabled={!valid} onClick={onStart}>🌙 {t.start}</button></div>}
    </div>
  )
}

function RoleCard({ title, role, detail }) {
  return <div className="extended-role-card"><span>{title}</span><strong>{role}</strong>{detail && <small>{detail}</small>}</div>
}

function SelectGrid({ players, selected, onToggle, disabled, single = false }) {
  const values = new Set(Array.isArray(selected) ? selected : selected ? [selected] : [])
  return (
    <div className="vote-grid extended-grid">
      {players.map((player) => <button disabled={disabled} className={values.has(player.id) ? 'active' : ''} key={player.id} onClick={() => onToggle(player.id, single)}>{player.name}</button>)}
    </div>
  )
}

function Finish({ room, playerId, action, winner, roles, t }) {
  return (
    <div className="extended-finish">
      <div className="mafia-phase town">{t.winner}: {winner}</div>
      {roles && <div className="mafia-roster">{room.players.map((player) => <div className="mafia-player" key={player.id}><span>{player.name}</span><b>{roles[player.id]}</b></div>)}</div>}
      {room.hostId === playerId && <button className="primary big" onClick={() => void action({ type: 'resetExtended' })}>{t.reset}</button>}
    </div>
  )
}

function Avalon({ room, playerId, action, lang }) {
  const t = tFor(lang)
  const s = room.state
  const [team, setTeam] = useState([])
  const [target, setTarget] = useState('')
  const [specials, setSpecials] = useState({ percival: true, morgana: true, mordred: false, oberon: false })
  useEffect(() => { setTeam([]); setTarget('') }, [s.status, s.mission])
  const evilSlots = (room.players.length <= 6 ? 2 : room.players.length <= 9 ? 3 : 4) - 1
  const toggleSpecial = (key) => setSpecials((current) => {
    if (key !== 'percival' && !current[key] && ['morgana', 'mordred', 'oberon'].filter((roleKey) => current[roleKey]).length >= evilSlots) return current
    return { ...current, [key]: !current[key] }
  })
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={5} max={10} t={t} onStart={() => void action({ type: 'startAvalon', ...specials })}><div className="choice-row">{Object.keys(specials).map((key) => <button className={specials[key] ? 'active' : ''} key={key} onClick={() => toggleSpecial(key)}>{t[key] || key}</button>)}</div></SetupGate>
  const role = s.me?.role
  const known = s.known?.map((item) => item.name).join(', ')
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={s.winner === 'good' ? t.good : t.evil} roles={Object.fromEntries(room.players.map((p) => [p.id, t[s.assignments?.[p.id]?.role] || s.assignments?.[p.id]?.role]))} t={t} />
  const leader = s.leaderId === playerId
  const teamSizes = { 5: [2, 3, 2, 3, 3], 6: [2, 3, 4, 3, 4], 7: [2, 3, 3, 4, 4], 8: [3, 4, 4, 5, 5], 9: [3, 4, 4, 5, 5], 10: [3, 4, 4, 5, 5] }
  const needed = teamSizes[room.players.length]?.[s.mission] || 0
  const onToggle = (id) => setTeam((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < needed ? [...current, id] : current)
  const voteCount = Object.keys(s.votes || {}).length
  return <div className="extended-game avalon-game"><RoleCard title={t.yourRole} role={t[role] || role} detail={known ? `${t.known}: ${known}` : ''} />
    <div className="avalon-board"><div className="avalon-missions">{Array.from({ length: 5 }, (_, index) => { const result = s.history?.find((item) => item.mission === index + 1); return <div className={`${result ? (result.success ? 'success' : 'fail') : ''} ${index === s.mission ? 'current' : ''}`} key={index}><small>M{index + 1}</small><strong>{result ? (result.success ? '✓' : '×') : teamSizes[room.players.length]?.[index]}</strong>{result && <span>{result.fails}F</span>}</div> })}</div><div className="avalon-reject-track"><span>{t.rejectTrack}</span><div>{Array.from({ length: 5 }, (_, index) => <i className={index < s.rejects ? 'filled' : ''} key={index} />)}</div><b>{s.rejects}/5</b></div></div>
    <div className="avalon-leader"><span>♛</span><div><small>{t.leader}</small><strong>{nameOf(room, s.leaderId)}</strong></div><b>{t.mission} {s.mission + 1} · 👥 {needed}</b></div>
    {room.players.length >= 7 && s.mission === 3 && <p className="avalon-warning">⚠ {t.missionFourRule}</p>}
    {s.status === 'teamBuilding' && leader && <section className="avalon-action-card"><div className="avalon-action-head"><strong>{t.proposeTeam}</strong><small>{t.chooseExact}: {needed} · {team.length}/{needed}</small></div><SelectGrid players={room.players} selected={team} onToggle={onToggle} /><button className="primary big" disabled={team.length !== needed} onClick={() => void action({ type: 'avalonPropose', teamIds: team })}>{t.proposeTeam}</button></section>}
    {s.status === 'teamBuilding' && !leader && <p className="host-note">{t.leader}: {nameOf(room, s.leaderId)}</p>}
    {s.status === 'teamVote' && <section className="avalon-action-card"><div className="avalon-action-head"><strong>{t.teamProposal}</strong><small>{s.proposedTeam.map((id) => nameOf(room, id)).join(', ')}</small></div><div className="choice-row"><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'avalonVote', approve: true })}>{t.approve}</button><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'avalonVote', approve: false })}>{t.reject}</button></div><p className="vote-progress">{t.votesReceived}: {voteCount}/{room.players.length}</p></section>}
    {s.status === 'mission' && s.proposedTeam.includes(playerId) && <section className="avalon-action-card"><div className="avalon-action-head"><strong>{t.mission} {s.mission + 1}</strong><small>{t.missionVote}: {s.missionVoteCount}/{s.proposedTeam.length}</small></div><div className="choice-row"><button disabled={s.myMissionVoted} onClick={() => void action({ type: 'avalonMission', choice: 'success' })}>{t.success}</button>{s.me.team === 'evil' && <button disabled={s.myMissionVoted} onClick={() => void action({ type: 'avalonMission', choice: 'fail' })}>{t.fail}</button>}</div></section>}
    {s.status === 'mission' && !s.proposedTeam.includes(playerId) && <p className="host-note">{t.missionVote}: {s.missionVoteCount}/{s.proposedTeam.length}</p>}
    {s.status === 'assassination' && role === 'assassin' && <section className="avalon-action-card"><div className="avalon-action-head"><strong>{t.assassinate}</strong><small>Merlin</small></div><SelectGrid players={room.players.filter((p) => p.id !== playerId)} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'avalonAssassinate', targetId: target })}>{t.assassinate}</button></section>}
    {s.status === 'assassination' && role !== 'assassin' && <p className="host-note">{t.waitingVotes}</p>}
  </div>
}

function SecretHitler({ room, playerId, action, lang }) {
  const t = tFor(lang)
  const s = room.state
  const [target, setTarget] = useState('')
  useEffect(() => setTarget(''), [s.status, s.presidentId])
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={5} max={10} t={t} onStart={() => void action({ type: 'startHitler' })} />
  const role = s.me?.role
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={s.winner === 'liberal' ? t.liberal : t.fascist} roles={Object.fromEntries(room.players.map((p) => [p.id, t[s.assignments?.[p.id]?.role] || s.assignments?.[p.id]?.role]))} t={t} />
  const alive = room.players.filter((p) => !s.deadIds?.includes(p.id))
  const targets = alive.filter((p) => p.id !== playerId)
  const chancellorTargets = alive.filter((p) => p.id !== s.presidentId && p.id !== s.lastChancellorId && !(alive.length > 5 && p.id === s.lastPresidentId))
  const governmentVoteCount = Object.keys(s.votes || {}).length
  const known = s.known?.map((item) => `${item.name} (${t[item.role] || item.role})`).join(', ')
  return (
    <div className="extended-game hitler-game">
      <RoleCard title={t.yourRole} role={t[role] || role} detail={known} />
      <div className="hitler-policy-tracks"><PolicyTrack type="liberal" count={s.liberalPolicies} max={5} label={t.policyL} /><PolicyTrack type="fascist" count={s.fascistPolicies} max={6} label={t.policyF} /><div className="election-tracker"><span>{t.election}</span><div>{[0, 1, 2].map((slot) => <i className={slot < s.electionTracker ? 'filled' : ''} key={slot} />)}</div><b>{s.electionTracker}/3</b></div></div>

      <div className="hitler-government"><div><small>{t.president}</small><strong>{nameOf(room, s.presidentId)}</strong></div><span>→</span><div><small>{t.chancellor}</small><strong>{s.chancellorId ? nameOf(room, s.chancellorId) : s.nomineeId ? nameOf(room, s.nomineeId) : '—'}</strong></div></div>

      {s.status === 'nomination' && s.presidentId === playerId && <section className="hitler-election-card"><div className="hitler-phase-title"><span>🤝</span><div><strong>{t.nominate}</strong><small>{t.chancellor}</small></div></div><SelectGrid players={chancellorTargets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerNominate', targetId: target })}>{t.nominate}</button></section>}
      {s.status === 'nomination' && s.presidentId !== playerId && <p className="host-note">{t.waitingChancellor}</p>}

      {s.status === 'election' && <section className="hitler-election-card"><p className="online-note">{t.president}: {nameOf(room, s.presidentId)} · {t.chancellor}: {nameOf(room, s.nomineeId)}</p><div className="choice-row"><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'hitlerVote', approve: true })}>{t.ja}</button><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'hitlerVote', approve: false })}>{t.nein}</button></div><p className="vote-progress">{t.votesReceived}: {governmentVoteCount}/{alive.length}</p></section>}
      {s.status === 'legislativePresident' && s.presidentId === playerId && <PolicyHand cards={s.legislativeHand} label={t.discard} onPick={(index) => action({ type: 'hitlerDiscard', index })} t={t} />}
      {s.status === 'legislativePresident' && s.presidentId !== playerId && <p className="host-note">{t.president}: {nameOf(room, s.presidentId)}</p>}
      {s.status === 'legislativeChancellor' && s.chancellorId === playerId && <PolicyHand cards={s.legislativeHand} label={t.enact} onPick={(index) => action({ type: 'hitlerEnact', index })} t={t} />}
      {s.status === 'legislativeChancellor' && s.chancellorId !== playerId && <p className="host-note">{t.chancellor}: {nameOf(room, s.chancellorId)}</p>}
      {s.status === 'investigation' && s.presidentId === playerId && <section className="hitler-election-card"><div className="hitler-phase-title"><span>🔎</span><div><strong>{t.investigateParty}</strong><small>{t.select}</small></div></div><SelectGrid players={targets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerInvestigate', targetId: target })}>{t.investigateParty}</button></section>}
      {s.status === 'investigation' && s.presidentId !== playerId && <p className="host-note">{t.president}: {nameOf(room, s.presidentId)} · {t.investigateParty}</p>}
      {s.status === 'specialElection' && s.presidentId === playerId && <section className="hitler-election-card"><div className="hitler-phase-title"><span>⭐</span><div><strong>{t.chooseNextPresident}</strong><small>{t.select}</small></div></div><SelectGrid players={targets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerSpecialPresident', targetId: target })}>{t.chooseNextPresident}</button></section>}
      {s.status === 'specialElection' && s.presidentId !== playerId && <p className="host-note">{t.chooseNextPresident}</p>}
      {s.status === 'policyPeek' && s.presidentId === playerId && <section className="hitler-election-card"><div className="hitler-phase-title"><span>👁️</span><div><strong>{t.peekPolicies}</strong><small>{t.president}</small></div></div><div className="peek-policy-row">{s.peekedPolicies?.map((policy, index) => <span className={policy} key={`${policy}-${index}`}>{policy === 'liberal' ? t.policyL : t.policyF}</span>)}</div><button className="primary big" onClick={() => void action({ type: 'hitlerPeekDone' })}>{t.continueGame}</button></section>}
      {s.status === 'policyPeek' && s.presidentId !== playerId && <p className="host-note">{t.president}: {nameOf(room, s.presidentId)} · {t.peekPolicies}</p>}
      {s.status === 'execution' && s.presidentId === playerId && <section className="hitler-election-card"><div className="hitler-phase-title"><span>🎯</span><div><strong>{t.execute}</strong><small>{t.select}</small></div></div><SelectGrid players={targets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerExecute', targetId: target })}>{t.execute}</button></section>}
      {s.status === 'execution' && s.presidentId !== playerId && <p className="host-note">{t.president}: {nameOf(room, s.presidentId)} · {t.execute}</p>}
      {s.myInvestigations?.length > 0 && <div className="hitler-investigations"><strong>{t.investigationResult}</strong>{s.myInvestigations.map((item, index) => <span key={`${item.targetId}-${index}`}>{nameOf(room, item.targetId)} — {item.party === 'liberal' ? t.liberal : t.fascist}</span>)}</div>}
    </div>
  )
}

function PolicyTrack({ type, count, max, label }) {
  return <div className={`policy-track ${type}`}><div><strong>{label}</strong><b>{count}/{max}</b></div><div className="policy-slots">{Array.from({ length: max }, (_, index) => <span className={index < count ? 'filled' : ''} key={index}>{index < count ? '◆' : ''}</span>)}</div></div>
}

function PolicyHand({ cards = [], label, onPick, t }) {
  return <div className="policy-hand">{cards.map((card, index) => <button className={card} key={`${card}-${index}`} onClick={() => void onPick(index)}><b>{card === 'liberal' ? t.policyL : t.policyF}</b><small>{label}</small></button>)}</div>
}

function Wink({ room, playerId, action, lang }) {
  const t = tFor(lang); const s = room.state; const [target, setTarget] = useState('')
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={6} t={t} onStart={() => void action({ type: 'startWink' })} />
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={s.winner === 'town' ? t.detective : t.murderer} roles={Object.fromEntries(room.players.map((p) => [p.id, s.assignments?.[p.id]]))} t={t} />
  const active = room.players.filter((p) => !s.deadIds.includes(p.id) && p.id !== playerId)
  const canKill = s.me.role === 'murderer' && !s.me.dead
  const canGuess = s.me.role === 'detective' && !s.me.dead
  return <div className="extended-game"><RoleCard title={t.yourRole} role={t[s.me.role] || s.me.role} detail={canGuess ? `${t.guesses}: ${s.guessesLeft}` : ''} /><SelectGrid players={active} selected={target} single onToggle={(id) => setTarget(id)} disabled={!canKill && !canGuess} />{canKill && <button className="primary big" disabled={!target || !s.killReady} onClick={() => void action({ type: 'winkKill', targetId: target })}>{t.kill}</button>}{canGuess && <button className="primary big" disabled={!target} onClick={() => void action({ type: 'winkGuess', targetId: target })}>{t.guess}</button>}{room.hostId === playerId && !s.killReady && <button className="ghost" onClick={() => void action({ type: 'winkNext' })}>{t.nextKill}</button>}<div className="mafia-roster">{room.players.map((p) => <div className={`mafia-player ${s.deadIds.includes(p.id) ? 'out' : ''}`} key={p.id}><span>{p.name}</span></div>)}</div></div>
}

function TwoRooms({ room, playerId, action, lang }) {
  const t = tFor(lang); const s = room.state; const [selected, setSelected] = useState([]); const [shareTarget, setShareTarget] = useState('')
  useEffect(() => setSelected([]), [s.round])
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={10} t={t} onStart={() => void action({ type: 'startTwoRooms' })} />
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={s.winner === 'red' ? t.red : t.blue} roles={Object.fromEntries(room.players.map((p) => [p.id, `${s.assignments?.[p.id]?.team} · ${s.assignments?.[p.id]?.role}`]))} t={t} />
  const roomKey = s.rooms.A.includes(playerId) ? 'A' : 'B'; const people = room.players.filter((p) => s.rooms[roomKey].includes(p.id)); const leader = s.leaders[roomKey] === playerId
  const needed = s.round === 1 ? Math.min(3, Math.floor(people.length / 2)) : s.round === 2 ? 2 : 1
  const toggle = (id) => setSelected((v) => v.includes(id) ? v.filter((x) => x !== id) : v.length < needed ? [...v, id] : v)
  return <div className="extended-game"><RoleCard title={t.yourRole} role={`${t[s.me.role + 'Role'] || t[s.me.role] || s.me.role} · ${t[s.me.team]}`} detail={`${t.room} ${roomKey} · ${t.round} ${s.round}/${s.totalRounds}`} /><SelectGrid players={people.filter((p) => p.id !== playerId)} selected={shareTarget} single onToggle={(id) => setShareTarget(id)} />{shareTarget && <div className="choice-row"><button onClick={() => void action({ type: 'twoRoomsShare', targetId: shareTarget, full: false })}>{t.shareColor}</button><button onClick={() => void action({ type: 'twoRoomsShare', targetId: shareTarget, full: true })}>{t.shareRole}</button></div>}{s.sharedWithMe?.map((share) => <p className="online-note" key={share.id}>{share.name}: {t[share.team]} {share.role ? `· ${t[share.role] || share.role}` : ''}</p>)}{leader && <><p className="host-note">{t.select}: {needed}</p><SelectGrid players={people} selected={selected} onToggle={toggle} /><button className="primary big" disabled={selected.length !== needed} onClick={() => void action({ type: 'twoRoomsHostages', playerIds: selected })}>{t.sendHostages}</button></>}</div>
}

const CARD_NAMES = { bang: 'BANG!', missed: 'MISSED!', beer: 'BEER', jail: 'JAIL', dynamite: 'DYNAMITE', scope: 'ЗЭВСЭГ' }
function Bang({ room, playerId, action, lang }) {
  const t = tFor(lang); const s = room.state; const [target, setTarget] = useState('')
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={4} max={7} t={t} onStart={() => void action({ type: 'startBang' })} />
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={t[s.winner] || s.winner} roles={Object.fromEntries(room.players.map((p) => [p.id, t[s.assignments?.[p.id]] || s.assignments?.[p.id]]))} t={t} />
  const alive = room.players.filter((p) => !s.deadIds.includes(p.id)); const myTurn = s.turnId === playerId
  return <div className="extended-game"><RoleCard title={t.yourRole} role={t[s.myRole] || s.myRole} detail={`${t.hp}: ${s.hp[playerId]}/${s.maxHp[playerId]}`} /><p className="host-note">{t.turn}: {nameOf(room, s.turnId)}</p><div className="bang-table">{room.players.map((p) => <button className={`${target === p.id ? 'active' : ''} ${s.deadIds.includes(p.id) ? 'out' : ''}`} key={p.id} onClick={() => setTarget(p.id)}><b>{p.name}</b><small>{t.hp}: {s.hp[p.id]} {s.visibleRoles?.[p.id] ? `· ${t[s.visibleRoles[p.id]]}` : ''}</small></button>)}</div>{s.pendingShot?.targetId === playerId && <div className="choice-row"><button onClick={() => void action({ type: 'bangRespond', useMissed: true })}>{t.respondMissed}</button><button onClick={() => void action({ type: 'bangRespond', useMissed: false })}>{t.takeHit}</button></div>}<h3 className="section-title">{t.hand}</h3><div className="bang-hand">{s.myHand.map((card, index) => <button disabled={!myTurn || Boolean(s.pendingShot)} className={`bang-card ${card}`} key={`${card}-${index}`} onClick={() => void action({ type: 'bangPlay', index, targetId: target })}><b>{CARD_NAMES[card]}</b><small>{t.use}</small></button>)}</div>{myTurn && !s.pendingShot && <button className="primary big" onClick={() => void action({ type: 'bangEndTurn' })}>{t.endTurn}</button>}</div>
}

export function ExtendedOnlineGame({ room, playerId, action, lang }) {
  if (room.gameType === 'avalon') return <Avalon {...{ room, playerId, action, lang }} />
  if (room.gameType === 'hitler') return <SecretHitler {...{ room, playerId, action, lang }} />
  if (room.gameType === 'wink') return <Wink {...{ room, playerId, action, lang }} />
  if (room.gameType === 'twoRooms') return <TwoRooms {...{ room, playerId, action, lang }} />
  if (room.gameType === 'bang') return <Bang {...{ room, playerId, action, lang }} />
  return null
}

export function gameLabel(gameType) {
  return GAME_CATALOG.find((game) => game.id === gameType)?.name || gameType
}

export function gameIcon(gameType) {
  return GAME_CATALOG.find((game) => game.id === gameType)?.icon || '🎲'
}
