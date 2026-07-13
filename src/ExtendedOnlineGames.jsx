import { useEffect, useMemo, useState } from 'react'

export const GAME_CATALOG = [
  { id: 'imposter', icon: '◉', name: 'Imposter', players: '3–12', kind: 'words' },
  { id: 'mafia', icon: '☾', name: 'Мафиа', players: '5–12', kind: 'social' },
  { id: 'avalon', icon: '♜', name: 'Avalon', players: '5–10', kind: 'social' },
  { id: 'hitler', icon: '▣', name: 'Secret Hitler', players: '5–10', kind: 'politics' },
  { id: 'wink', icon: '◔', name: 'Wink Murder', players: '6+', kind: 'quick' },
  { id: 'twoRooms', icon: '⇄', name: 'Two Rooms', players: '10+', kind: 'large' },
  { id: 'bang', icon: '✦', name: 'Bang!', players: '4–7', kind: 'cards' },
  { id: 'planes', icon: '✈', name: 'Онгоц', players: '2+', kind: 'strategy' },
  { id: 'number', icon: '#', name: 'Тоо олох', players: '2+', kind: 'logic' },
]

const TEXT = {
  en: {
    chooseGame: 'Choose a game', changeGame: 'Change game', createThis: 'Create this room', cancel: 'Cancel',
    hostOnly: 'Waiting for the host.', need: 'Required players', start: 'Start game', reset: 'Play again',
    yourRole: 'Your role', known: 'You know', good: 'Good', evil: 'Evil', liberal: 'Liberals', fascist: 'Fascists',
    merlin: 'Merlin', percival: 'Percival', morgana: 'Morgana', mordred: 'Mordred', assassin: 'Assassin', minion: 'Minion of Mordred', loyal: 'Loyal servant', hitler: 'Hitler',
    winner: 'Winner', select: 'Select', approve: 'Approve', reject: 'Reject', success: 'Success', fail: 'Fail',
    leader: 'Leader', mission: 'Mission', proposeTeam: 'Propose team', waitingVotes: 'Waiting for votes', assassinate: 'Assassinate Merlin',
    nominate: 'Nominate Chancellor', ja: 'JA!', nein: 'NEIN!', discard: 'Discard', enact: 'Enact', execute: 'Execute',
    policyL: 'Liberal policy', policyF: 'Fascist policy', election: 'Election tracker', president: 'President', chancellor: 'Chancellor',
    murderer: 'Murderer', detective: 'Detective', bystander: 'Bystander', kill: 'Secretly kill', guess: 'Accuse murderer', nextKill: 'Allow next kill', guesses: 'Guesses left',
    presidentRole: 'President', bomber: 'Bomber', member: 'Team member', blue: 'Blue', red: 'Red', room: 'Room', round: 'Round', shareColor: 'Share color', shareRole: 'Share full role', sendHostages: 'Exchange hostages',
    sheriff: 'Sheriff', deputy: 'Deputy', outlaw: 'Outlaw', renegade: 'Renegade', hp: 'HP', turn: 'Turn', endTurn: 'End turn', use: 'Use', respondMissed: 'Use MISSED!', takeHit: 'Take hit', target: 'Target', hand: 'Your hand',
  },
  mn: {
    chooseGame: 'Тоглоом сонгох', changeGame: 'Тоглоом солих', createThis: 'Энэ тоглоомоор өрөө үүсгэх', cancel: 'Болих',
    hostOnly: 'Host-ыг хүлээж байна.', need: 'Шаардлагатай тоглогч', start: 'Тоглоом эхлүүлэх', reset: 'Дахин тоглох',
    yourRole: 'Таны дүр', known: 'Таны мэдэх хүмүүс', good: 'Сайн тал', evil: 'Муу тал', liberal: 'Либералууд', fascist: 'Фашистууд',
    merlin: 'Мерлин', percival: 'Персиваль', morgana: 'Моргана', mordred: 'Мордред', assassin: 'Ассасин', minion: 'Мордредийн хүн', loyal: 'Артурын үнэнч хүн', hitler: 'Гитлер',
    winner: 'Ялагч', select: 'Сонгох', approve: 'Дэмжинэ', reject: 'Дэмжихгүй', success: 'Амжилт', fail: 'Сүйтгэх',
    leader: 'Ахлагч', mission: 'Даалгавар', proposeTeam: 'Багийг санал болгох', waitingVotes: 'Саналуудыг хүлээж байна', assassinate: 'Мерлинийг устгах',
    nominate: 'Канцлер нэр дэвшүүлэх', ja: 'ДЭМЖИНЭ', nein: 'ДЭМЖИХГҮЙ', discard: 'Хаях', enact: 'Батлах', execute: 'Устгах',
    policyL: 'Либерал бодлого', policyF: 'Фашист бодлого', election: 'Сонгуулийн тоолуур', president: 'Ерөнхийлөгч', chancellor: 'Канцлер',
    murderer: 'Алуурчин', detective: 'Мөрдөгч', bystander: 'Энгийн хүн', kill: 'Нууцаар алах', guess: 'Алуурчныг таах', nextKill: 'Дараагийн аллагыг нээх', guesses: 'Таах эрх',
    presidentRole: 'Ерөнхийлөгч', bomber: 'Бөмбөгчин', member: 'Багийн гишүүн', blue: 'Цэнхэр', red: 'Улаан', room: 'Өрөө', round: 'Раунд', shareColor: 'Өнгөө харуулах', shareRole: 'Дүрээ бүтнээр харуулах', sendHostages: 'Барьцааны хүмүүсийг солих',
    sheriff: 'Шериф', deputy: 'Туслах', outlaw: 'Дээрэмчин', renegade: 'Урвагч', hp: 'Амь', turn: 'Ээлж', endTurn: 'Ээлж дуусгах', use: 'Ашиглах', respondMissed: 'MISSED! ашиглах', takeHit: 'Суманд оногдох', target: 'Бай', hand: 'Таны карт',
  },
  kk: {},
}

const tFor = (lang) => ({ ...TEXT.en, ...(TEXT[lang] || {}) })
const nameOf = (room, id) => room.players.find((player) => player.id === id)?.name || '—'

export function GameCatalog({ lang, selected, onSelect, compact = false }) {
  const t = tFor(lang)
  return (
    <section className={`game-catalog ${compact ? 'compact' : ''}`}>
      {!compact && <h2>{t.chooseGame}</h2>}
      <div className="game-card-grid">
        {GAME_CATALOG.map((game) => (
          <button key={game.id} className={`game-card ${selected === game.id ? 'active' : ''}`} onClick={() => onSelect(game.id)}>
            <span className={`game-icon kind-${game.kind}`}>{game.icon}</span>
            <span className="game-card-copy"><strong>{game.name}</strong><small>{game.players} хүн</small></span>
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
    <div className="extended-setup">
      <p className={valid ? 'online-note' : 'error'}>{t.need}: {min}{max ? `–${max}` : '+'}</p>
      {host ? <>{children}<button className="primary big" disabled={!valid} onClick={onStart}>{t.start}</button></> : <p className="host-note">{t.hostOnly}</p>}
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
  const [specials, setSpecials] = useState({ percival: true, morgana: true, mordred: false })
  useEffect(() => { setTeam([]); setTarget('') }, [s.status, s.mission])
  if (s.status === 'setup') return <SetupGate room={room} playerId={playerId} min={5} max={10} t={t} onStart={() => void action({ type: 'startAvalon', ...specials })}><div className="choice-row">{Object.keys(specials).map((key) => <button className={specials[key] ? 'active' : ''} key={key} onClick={() => setSpecials({ ...specials, [key]: !specials[key] })}>{key}</button>)}</div></SetupGate>
  const role = s.me?.role
  const known = s.known?.map((item) => item.name).join(', ')
  if (s.status === 'finished') return <Finish room={room} playerId={playerId} action={action} winner={s.winner === 'good' ? t.good : t.evil} roles={Object.fromEntries(room.players.map((p) => [p.id, t[s.assignments?.[p.id]?.role] || s.assignments?.[p.id]?.role]))} t={t} />
  const leader = s.leaderId === playerId
  const onToggle = (id) => setTeam((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  return <div className="extended-game"><RoleCard title={t.yourRole} role={t[role] || role} detail={known ? `${t.known}: ${known}` : ''} /><div className="score-track"><b>{t.success}: {s.successes}</b><b>{t.fail}: {s.failures}</b><span>{t.mission} {s.mission + 1}</span></div><p className="host-note">{t.leader}: {nameOf(room, s.leaderId)}</p>
    {s.status === 'teamBuilding' && leader && <><SelectGrid players={room.players} selected={team} onToggle={onToggle} /><button className="primary big" onClick={() => void action({ type: 'avalonPropose', teamIds: team })}>{t.proposeTeam}</button></>}
    {s.status === 'teamBuilding' && !leader && <p className="online-note">{t.hostOnly}</p>}
    {s.status === 'teamVote' && <><p className="online-note">{s.proposedTeam.map((id) => nameOf(room, id)).join(', ')}</p><div className="choice-row"><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'avalonVote', approve: true })}>{t.approve}</button><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'avalonVote', approve: false })}>{t.reject}</button></div></>}
    {s.status === 'mission' && s.proposedTeam.includes(playerId) && <div className="choice-row"><button onClick={() => void action({ type: 'avalonMission', choice: 'success' })}>{t.success}</button>{s.me.team === 'evil' && <button onClick={() => void action({ type: 'avalonMission', choice: 'fail' })}>{t.fail}</button>}</div>}
    {s.status === 'mission' && !s.proposedTeam.includes(playerId) && <p className="online-note">{t.waitingVotes}</p>}
    {s.status === 'assassination' && role === 'assassin' && <><SelectGrid players={room.players.filter((p) => s.assignments?.[p.id]?.team !== 'evil')} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'avalonAssassinate', targetId: target })}>{t.assassinate}</button></>}
    {s.status === 'assassination' && role !== 'assassin' && <p className="online-note">{t.waitingVotes}</p>}
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
  return <div className="extended-game"><RoleCard title={t.yourRole} role={t[role] || role} detail={s.known?.map((item) => `${item.name} (${t[item.role] || item.role})`).join(', ')} /><div className="policy-board"><span className="liberal-policy">{t.policyL}: <b>{s.liberalPolicies}/5</b></span><span className="fascist-policy">{t.policyF}: <b>{s.fascistPolicies}/6</b></span><small>{t.election}: {s.electionTracker}/3</small></div><p className="host-note">{t.president}: {nameOf(room, s.presidentId)} {s.chancellorId ? ` · ${t.chancellor}: ${nameOf(room, s.chancellorId)}` : ''}</p>
    {s.status === 'nomination' && s.presidentId === playerId && <><SelectGrid players={targets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerNominate', targetId: target })}>{t.nominate}</button></>}
    {s.status === 'election' && <div className="choice-row"><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'hitlerVote', approve: true })}>{t.ja}</button><button disabled={s.votes?.[playerId]} onClick={() => void action({ type: 'hitlerVote', approve: false })}>{t.nein}</button></div>}
    {s.status === 'legislativePresident' && s.presidentId === playerId && <PolicyHand cards={s.legislativeHand} label={t.discard} onPick={(index) => action({ type: 'hitlerDiscard', index })} t={t} />}
    {s.status === 'legislativeChancellor' && s.chancellorId === playerId && <PolicyHand cards={s.legislativeHand} label={t.discard} onPick={(index) => action({ type: 'hitlerEnact', index })} t={t} />}
    {s.status === 'execution' && s.presidentId === playerId && <><SelectGrid players={targets} selected={target} single onToggle={(id) => setTarget(id)} /><button className="primary big" disabled={!target} onClick={() => void action({ type: 'hitlerExecute', targetId: target })}>{t.execute}</button></>}
  </div>
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
