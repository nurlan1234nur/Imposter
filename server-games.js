const EXTENDED_GAMES = new Set(['avalon', 'hitler', 'wink', 'twoRooms', 'bang'])

const shuffle = (items) => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const alivePlayers = (room, state) => room.players.filter((player) => !state.deadIds?.includes(player.id))
const nextAlive = (room, state, playerId) => {
  const start = Math.max(0, room.players.findIndex((player) => player.id === playerId))
  for (let offset = 1; offset <= room.players.length; offset += 1) {
    const player = room.players[(start + offset) % room.players.length]
    if (!state.deadIds?.includes(player.id)) return player.id
  }
  return null
}

export function isExtendedGame(gameType) {
  return EXTENDED_GAMES.has(gameType)
}

export function initialExtendedState(gameType) {
  if (!isExtendedGame(gameType)) return null
  return { status: 'setup' }
}

export function canSwitchExtended(room) {
  return isExtendedGame(room.gameType) && ['setup', 'finished'].includes(room.state?.status)
}

function publicAvalon(room, state, viewerId) {
  if (!state.assignments) return state
  const mine = state.assignments[viewerId]
  let known = []
  if (mine?.team === 'evil' && mine?.role !== 'oberon') {
    known = room.players.filter((player) => state.assignments[player.id]?.team === 'evil' && state.assignments[player.id]?.role !== 'oberon').map((player) => ({ id: player.id, name: player.name, hint: 'evil' }))
  } else if (mine?.role === 'merlin') {
    known = room.players.filter((player) => state.assignments[player.id]?.team === 'evil' && state.assignments[player.id]?.role !== 'mordred').map((player) => ({ id: player.id, name: player.name, hint: 'evil' }))
  } else if (mine?.role === 'percival') {
    known = room.players.filter((player) => ['merlin', 'morgana'].includes(state.assignments[player.id]?.role)).map((player) => ({ id: player.id, name: player.name, hint: 'merlinMaybe' }))
  }
  return {
    ...state,
    assignments: state.status === 'finished' ? state.assignments : undefined,
    missionChoices: undefined,
    missionVoteCount: Object.keys(state.missionChoices || {}).length,
    myMissionVoted: Boolean(state.missionChoices?.[viewerId]),
    votes: Object.fromEntries(Object.keys(state.votes || {}).map((id) => [id, true])),
    me: mine,
    known,
  }
}

function publicHitler(room, state, viewerId) {
  if (!state.assignments) return state
  const mine = state.assignments[viewerId]
  const knowsTeam = mine?.role === 'fascist' || (mine?.role === 'hitler' && room.players.length <= 6)
  const known = knowsTeam
    ? room.players.filter((player) => ['fascist', 'hitler'].includes(state.assignments[player.id]?.role)).map((player) => ({ id: player.id, name: player.name, role: state.assignments[player.id].role }))
    : []
  const hand = state.status === 'legislativePresident' && state.presidentId === viewerId
    ? state.legislativeHand : state.status === 'legislativeChancellor' && state.chancellorId === viewerId ? state.legislativeHand : []
  const peekedPolicies = state.status === 'policyPeek' && state.presidentId === viewerId ? state.deck.slice(0, 3) : []
  return {
    ...state,
    deck: undefined,
    discard: undefined,
    legislativeHand: hand,
    peekedPolicies,
    investigations: undefined,
    myInvestigations: (state.investigations || []).filter((item) => item.presidentId === viewerId),
    assignments: state.status === 'finished' ? state.assignments : undefined,
    votes: Object.fromEntries(Object.keys(state.votes || {}).map((id) => [id, true])),
    me: mine,
    known,
  }
}

function publicWink(state, viewerId) {
  if (!state.assignments) return state
  return {
    ...state,
    assignments: state.status === 'finished' ? state.assignments : undefined,
    me: { role: state.assignments[viewerId], dead: state.deadIds.includes(viewerId) },
  }
}

function publicTwoRooms(room, state, viewerId) {
  if (!state.assignments) return state
  return {
    ...state,
    assignments: state.status === 'finished' ? state.assignments : undefined,
    me: state.assignments[viewerId],
    sharedWithMe: Object.entries(state.shares?.[viewerId] || {}).map(([id, value]) => ({ id, name: room.players.find((player) => player.id === id)?.name, ...value })),
    shares: undefined,
  }
}

function publicBang(room, state, viewerId) {
  if (!state.assignments) return state
  const dead = state.deadIds || []
  const visibleRoles = {}
  for (const player of room.players) {
    if (player.id === viewerId || state.assignments[player.id] === 'sheriff' || dead.includes(player.id) || state.status === 'finished') visibleRoles[player.id] = state.assignments[player.id]
  }
  return {
    ...state,
    deck: undefined,
    discard: undefined,
    hands: undefined,
    myHand: state.hands[viewerId] || [],
    myRole: state.assignments[viewerId],
    visibleRoles,
    assignments: state.status === 'finished' ? state.assignments : undefined,
  }
}

export function publicExtendedState(room, viewerId) {
  const state = room.state || {}
  if (room.gameType === 'avalon') return publicAvalon(room, state, viewerId)
  if (room.gameType === 'hitler') return publicHitler(room, state, viewerId)
  if (room.gameType === 'wink') return publicWink(state, viewerId)
  if (room.gameType === 'twoRooms') return publicTwoRooms(room, state, viewerId)
  if (room.gameType === 'bang') return publicBang(room, state, viewerId)
  return state
}

const AVALON_TEAMS = {
  5: [2, 3, 2, 3, 3], 6: [2, 3, 4, 3, 4], 7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5], 9: [3, 4, 4, 5, 5], 10: [3, 4, 4, 5, 5],
}

function startAvalon(room, state, action) {
  const count = room.players.length
  if (count < 5 || count > 10) return
  const evilCount = count <= 6 ? 2 : count <= 9 ? 3 : 4
  const evilRoles = ['assassin']
  if (action.morgana && evilRoles.length < evilCount) evilRoles.push('morgana')
  if (action.mordred && evilRoles.length < evilCount) evilRoles.push('mordred')
  if (action.oberon && evilRoles.length < evilCount) evilRoles.push('oberon')
  while (evilRoles.length < evilCount) evilRoles.push('minion')
  const goodRoles = ['merlin']
  if (action.percival) goodRoles.push('percival')
  while (goodRoles.length < count - evilCount) goodRoles.push('loyal')
  const roles = shuffle([...evilRoles, ...goodRoles])
  state.status = 'teamBuilding'
  state.assignments = {}
  room.players.forEach((player, index) => { state.assignments[player.id] = { role: roles[index], team: evilRoles.includes(roles[index]) ? 'evil' : 'good' } })
  state.leaderId = room.players[Math.floor(Math.random() * count)].id
  state.mission = 0
  state.successes = 0
  state.failures = 0
  state.rejects = 0
  state.proposedTeam = []
  state.votes = {}
  state.missionChoices = {}
  state.history = []
  state.winner = null
}

function applyAvalon(room, playerId, action) {
  const state = room.state
  if (action.type === 'startAvalon' && playerId === room.hostId && state.status === 'setup') return startAvalon(room, state, action)
  if (action.type === 'avalonPropose' && state.status === 'teamBuilding' && state.leaderId === playerId) {
    const needed = AVALON_TEAMS[room.players.length]?.[state.mission]
    const team = [...new Set(action.teamIds || [])].filter((id) => room.players.some((player) => player.id === id))
    if (team.length !== needed) return
    state.proposedTeam = team
    state.votes = {}
    state.status = 'teamVote'
    return
  }
  if (action.type === 'avalonVote' && state.status === 'teamVote' && !state.votes[playerId]) {
    state.votes[playerId] = action.approve ? 'approve' : 'reject'
    if (Object.keys(state.votes).length === room.players.length) {
      const approved = Object.values(state.votes).filter((vote) => vote === 'approve').length > room.players.length / 2
      state.lastVote = { approved, approvals: Object.values(state.votes).filter((vote) => vote === 'approve').length }
      state.votes = {}
      if (approved) {
        state.status = 'mission'
        state.missionChoices = {}
        state.rejects = 0
      } else {
        state.rejects += 1
        state.leaderId = nextAlive(room, { deadIds: [] }, state.leaderId)
        state.proposedTeam = []
        if (state.rejects >= 5) { state.status = 'finished'; state.winner = 'evil' } else state.status = 'teamBuilding'
      }
    }
    return
  }
  if (action.type === 'avalonMission' && state.status === 'mission' && state.proposedTeam.includes(playerId) && !state.missionChoices[playerId]) {
    const isEvil = state.assignments[playerId].team === 'evil'
    state.missionChoices[playerId] = isEvil && action.choice === 'fail' ? 'fail' : 'success'
    if (Object.keys(state.missionChoices).length === state.proposedTeam.length) {
      const fails = Object.values(state.missionChoices).filter((choice) => choice === 'fail').length
      const threshold = room.players.length >= 7 && state.mission === 3 ? 2 : 1
      const success = fails < threshold
      if (success) state.successes += 1
      else state.failures += 1
      state.history.push({ mission: state.mission + 1, success, fails, team: state.proposedTeam })
      state.mission += 1
      state.leaderId = nextAlive(room, { deadIds: [] }, state.leaderId)
      state.proposedTeam = []
      state.missionChoices = {}
      if (state.failures >= 3) { state.status = 'finished'; state.winner = 'evil' }
      else if (state.successes >= 3) state.status = 'assassination'
      else state.status = 'teamBuilding'
    }
    return
  }
  if (action.type === 'avalonAssassinate' && state.status === 'assassination' && state.assignments[playerId]?.role === 'assassin') {
    if (action.targetId === playerId || !room.players.some((player) => player.id === action.targetId)) return
    state.assassinatedId = action.targetId
    state.winner = state.assignments[action.targetId]?.role === 'merlin' ? 'evil' : 'good'
    state.status = 'finished'
    return
  }
  if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
}

function hitlerRoles(count) {
  const fascists = count <= 6 ? 1 : count <= 8 ? 2 : 3
  return shuffle(['hitler', ...Array(fascists).fill('fascist'), ...Array(count - fascists - 1).fill('liberal')])
}

function refillPolicies(state) {
  if (state.deck.length < 3) {
    state.deck = shuffle([...state.deck, ...state.discard])
    state.discard = []
  }
}

function drawPolicies(state, count) {
  refillPolicies(state)
  return state.deck.splice(0, count)
}

function hitlerWinner(state) {
  if (state.liberalPolicies >= 5) return 'liberal'
  if (state.fascistPolicies >= 6) return 'fascist'
  return null
}

function nextHitlerPresident(room, state) {
  if (state.specialElectionReturnId) {
    state.presidentId = nextAlive(room, state, state.specialElectionReturnId)
    state.specialElectionReturnId = null
  } else state.presidentId = nextAlive(room, state, state.presidentId)
  state.chancellorId = null
  state.nomineeId = null
  state.votes = {}
  state.status = 'nomination'
}

function hitlerPower(playerCount, fascistPolicies) {
  if (fascistPolicies >= 4) return 'execution'
  if (playerCount <= 6) return fascistPolicies === 3 ? 'policyPeek' : null
  if (playerCount <= 8) return fascistPolicies === 2 ? 'investigation' : fascistPolicies === 3 ? 'specialElection' : null
  return fascistPolicies <= 2 ? 'investigation' : fascistPolicies === 3 ? 'specialElection' : null
}

function enactPolicy(room, state, policy) {
  if (policy === 'liberal') state.liberalPolicies += 1
  else state.fascistPolicies += 1
  state.lastPolicy = policy
  const winner = hitlerWinner(state)
  if (winner) { state.status = 'finished'; state.winner = winner; return }
  const power = policy === 'fascist' ? hitlerPower(room.players.length, state.fascistPolicies) : null
  if (power) state.status = power
  else nextHitlerPresident(room, state)
}

function applyHitler(room, playerId, action) {
  const state = room.state
  if (action.type === 'startHitler' && playerId === room.hostId && state.status === 'setup') {
    if (room.players.length < 5 || room.players.length > 10) return
    const roles = hitlerRoles(room.players.length)
    state.status = 'nomination'
    state.assignments = {}
    room.players.forEach((player, index) => { state.assignments[player.id] = { role: roles[index], team: roles[index] === 'liberal' ? 'liberal' : 'fascist' } })
    state.deadIds = []
    state.deck = shuffle([...Array(6).fill('liberal'), ...Array(11).fill('fascist')])
    state.discard = []
    state.liberalPolicies = 0
    state.fascistPolicies = 0
    state.electionTracker = 0
    state.presidentId = room.players[Math.floor(Math.random() * room.players.length)].id
    state.chancellorId = null
    state.lastPresidentId = null
    state.lastChancellorId = null
    state.votes = {}
    state.investigations = []
    state.specialElectionReturnId = null
    state.winner = null
    return
  }
  if (action.type === 'hitlerNominate' && state.status === 'nomination' && state.presidentId === playerId) {
    const target = action.targetId
    if (target === playerId || state.deadIds.includes(target) || !room.players.some((player) => player.id === target)) return
    if (target === state.lastChancellorId || (alivePlayers(room, state).length > 5 && target === state.lastPresidentId)) return
    state.nomineeId = target
    state.votes = {}
    state.status = 'election'
    return
  }
  if (action.type === 'hitlerVote' && state.status === 'election' && !state.deadIds.includes(playerId) && !state.votes[playerId]) {
    state.votes[playerId] = action.approve ? 'ja' : 'nein'
    const alive = alivePlayers(room, state)
    if (alive.every((player) => state.votes[player.id])) {
      const passed = Object.values(state.votes).filter((vote) => vote === 'ja').length > alive.length / 2
      state.lastElection = { passed, approvals: Object.values(state.votes).filter((vote) => vote === 'ja').length }
      state.votes = {}
      if (!passed) {
        state.electionTracker += 1
        if (state.electionTracker >= 3) {
          state.electionTracker = 0
          enactPolicy(room, state, drawPolicies(state, 1)[0])
        } else nextHitlerPresident(room, state)
      } else {
        state.chancellorId = state.nomineeId
        if (state.fascistPolicies >= 3 && state.assignments[state.chancellorId].role === 'hitler') { state.status = 'finished'; state.winner = 'fascist'; return }
        state.electionTracker = 0
        state.lastPresidentId = state.presidentId
        state.lastChancellorId = state.chancellorId
        state.legislativeHand = drawPolicies(state, 3)
        state.status = 'legislativePresident'
      }
    }
    return
  }
  if (action.type === 'hitlerDiscard' && state.status === 'legislativePresident' && state.presidentId === playerId) {
    const index = Number(action.index)
    if (index < 0 || index >= state.legislativeHand.length) return
    state.discard.push(state.legislativeHand.splice(index, 1)[0])
    state.status = 'legislativeChancellor'
    return
  }
  if (action.type === 'hitlerEnact' && state.status === 'legislativeChancellor' && state.chancellorId === playerId) {
    const index = Number(action.index)
    if (index < 0 || index >= state.legislativeHand.length) return
    const enacted = state.legislativeHand.splice(index, 1)[0]
    state.discard.push(...state.legislativeHand.splice(0))
    enactPolicy(room, state, enacted)
    return
  }
  if (action.type === 'hitlerExecute' && state.status === 'execution' && state.presidentId === playerId) {
    const target = action.targetId
    if (target === playerId || state.deadIds.includes(target)) return
    state.deadIds.push(target)
    if (state.assignments[target]?.role === 'hitler') { state.status = 'finished'; state.winner = 'liberal' }
    else nextHitlerPresident(room, state)
    return
  }
  if (action.type === 'hitlerInvestigate' && state.status === 'investigation' && state.presidentId === playerId) {
    const target = action.targetId
    if (target === playerId || state.deadIds.includes(target) || !state.assignments[target]) return
    state.investigations.push({ presidentId: playerId, targetId: target, party: state.assignments[target].team })
    nextHitlerPresident(room, state)
    return
  }
  if (action.type === 'hitlerPeekDone' && state.status === 'policyPeek' && state.presidentId === playerId) {
    nextHitlerPresident(room, state)
    return
  }
  if (action.type === 'hitlerSpecialPresident' && state.status === 'specialElection' && state.presidentId === playerId) {
    const target = action.targetId
    if (target === playerId || state.deadIds.includes(target) || !state.assignments[target]) return
    state.specialElectionReturnId = playerId
    state.presidentId = target
    state.chancellorId = null
    state.nomineeId = null
    state.votes = {}
    state.status = 'nomination'
    return
  }
  if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
}

function applyWink(room, playerId, action) {
  const state = room.state
  if (action.type === 'startWink' && playerId === room.hostId && state.status === 'setup') {
    if (room.players.length < 6) return
    const roles = shuffle(['murderer', 'detective', ...Array(room.players.length - 2).fill('bystander')])
    state.status = 'playing'
    state.assignments = {}
    room.players.forEach((player, index) => { state.assignments[player.id] = roles[index] })
    state.deadIds = []
    state.killReady = true
    state.guessesLeft = 3
    state.winner = null
    return
  }
  if (action.type === 'winkKill' && state.status === 'playing' && state.assignments[playerId] === 'murderer' && state.killReady) {
    const target = action.targetId
    if (target === playerId || state.deadIds.includes(target)) return
    state.deadIds.push(target)
    state.lastKilledId = target
    state.killReady = false
    if (state.assignments[target] === 'detective' || room.players.length - state.deadIds.length <= 2) { state.status = 'finished'; state.winner = 'murderer' }
    return
  }
  if (action.type === 'winkGuess' && state.status === 'playing' && state.assignments[playerId] === 'detective' && !state.deadIds.includes(playerId)) {
    if (state.assignments[action.targetId] === 'murderer') { state.status = 'finished'; state.winner = 'town' }
    else {
      state.guessesLeft -= 1
      state.lastWrongGuessId = action.targetId
      if (state.guessesLeft <= 0) { state.status = 'finished'; state.winner = 'murderer' }
    }
    return
  }
  if (action.type === 'winkNext' && playerId === room.hostId && state.status === 'playing') state.killReady = true
  if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
}

function applyTwoRooms(room, playerId, action) {
  const state = room.state
  if (action.type === 'startTwoRooms' && playerId === room.hostId && state.status === 'setup') {
    if (room.players.length < 10) return
    const ids = shuffle(room.players.map((player) => player.id))
    const presidentId = ids[0]
    const bomberId = ids[1]
    state.assignments = {}
    ids.forEach((id, index) => { state.assignments[id] = { role: id === presidentId ? 'president' : id === bomberId ? 'bomber' : 'member', team: index % 2 === 0 ? 'blue' : 'red' } })
    state.assignments[presidentId].team = 'blue'
    state.assignments[bomberId].team = 'red'
    state.rooms = { A: ids.slice(0, Math.ceil(ids.length / 2)), B: ids.slice(Math.ceil(ids.length / 2)) }
    state.leaders = { A: state.rooms.A[0], B: state.rooms.B[0] }
    state.round = 1
    state.totalRounds = 3
    state.hostageSelections = {}
    state.shares = {}
    state.status = 'playing'
    state.winner = null
    return
  }
  if (action.type === 'twoRoomsShare' && state.status === 'playing') {
    const target = action.targetId
    const sameRoom = Object.values(state.rooms).some((ids) => ids.includes(playerId) && ids.includes(target))
    if (!sameRoom) return
    if (!state.shares[target]) state.shares[target] = {}
    state.shares[target][playerId] = action.full ? state.assignments[playerId] : { team: state.assignments[playerId].team, role: null }
    return
  }
  if (action.type === 'twoRoomsHostages' && state.status === 'playing') {
    const roomKey = state.leaders.A === playerId ? 'A' : state.leaders.B === playerId ? 'B' : null
    if (!roomKey) return
    const needed = state.round === 1 ? Math.min(3, Math.floor(state.rooms[roomKey].length / 2)) : state.round === 2 ? 2 : 1
    const ids = [...new Set(action.playerIds || [])].filter((id) => state.rooms[roomKey].includes(id))
    if (ids.length !== needed) return
    state.hostageSelections[roomKey] = ids
    if (state.hostageSelections.A && state.hostageSelections.B) {
      const a = state.hostageSelections.A
      const b = state.hostageSelections.B
      state.rooms.A = state.rooms.A.filter((id) => !a.includes(id)).concat(b)
      state.rooms.B = state.rooms.B.filter((id) => !b.includes(id)).concat(a)
      state.lastSwap = { A: a, B: b }
      state.hostageSelections = {}
      if (state.round >= state.totalRounds) {
        const presidentRoom = state.rooms.A.includes(Object.keys(state.assignments).find((id) => state.assignments[id].role === 'president')) ? 'A' : 'B'
        const bomberRoom = state.rooms.A.includes(Object.keys(state.assignments).find((id) => state.assignments[id].role === 'bomber')) ? 'A' : 'B'
        state.winner = presidentRoom === bomberRoom ? 'red' : 'blue'
        state.status = 'finished'
      } else {
        state.round += 1
        state.leaders = { A: state.rooms.A[0], B: state.rooms.B[0] }
      }
    }
    return
  }
  if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
}

const BANG_DECK = shuffle([
  ...Array(24).fill('bang'), ...Array(12).fill('missed'), ...Array(8).fill('beer'),
  ...Array(5).fill('jail'), ...Array(3).fill('dynamite'), ...Array(8).fill('scope'),
])

function bangRoles(count) {
  const map = {
    4: ['sheriff', 'renegade', 'outlaw', 'outlaw'],
    5: ['sheriff', 'deputy', 'renegade', 'outlaw', 'outlaw'],
    6: ['sheriff', 'deputy', 'renegade', 'outlaw', 'outlaw', 'outlaw'],
    7: ['sheriff', 'deputy', 'deputy', 'renegade', 'outlaw', 'outlaw', 'outlaw'],
  }
  return shuffle(map[count] || [])
}

function bangDraw(state, playerId, count) {
  if (state.deck.length < count) { state.deck = shuffle([...state.deck, ...state.discard]); state.discard = [] }
  state.hands[playerId].push(...state.deck.splice(0, count))
}

function bangWin(room, state) {
  const alive = alivePlayers(room, state).map((player) => player.id)
  const sheriff = Object.keys(state.assignments).find((id) => state.assignments[id] === 'sheriff')
  if (!alive.includes(sheriff)) {
    if (alive.length === 1 && state.assignments[alive[0]] === 'renegade') return 'renegade'
    return 'outlaw'
  }
  if (alive.every((id) => ['sheriff', 'deputy'].includes(state.assignments[id]))) return 'sheriff'
  return null
}

function bangDamage(room, state, targetId, amount = 1) {
  state.hp[targetId] -= amount
  if (state.hp[targetId] <= 0 && !state.deadIds.includes(targetId)) state.deadIds.push(targetId)
  const winner = bangWin(room, state)
  if (winner) { state.status = 'finished'; state.winner = winner; state.pendingShot = null }
}

function beginBangTurn(room, state, playerId) {
  state.turnId = playerId
  state.bangPlayed = false
  if (state.jailed[playerId]) {
    delete state.jailed[playerId]
    if (Math.random() < 0.5) { state.lastEvent = { type: 'jailSkip', playerId }; return beginBangTurn(room, state, nextAlive(room, state, playerId)) }
  }
  if (state.dynamiteId === playerId) {
    if (Math.random() < 0.2) { state.dynamiteId = null; bangDamage(room, state, playerId, 3) }
    else state.dynamiteId = nextAlive(room, state, playerId)
    if (state.status === 'finished') return
    if (state.deadIds.includes(playerId)) return beginBangTurn(room, state, nextAlive(room, state, playerId))
  }
  bangDraw(state, playerId, 2)
}

function bangDistance(room, state, fromId, toId) {
  const alive = alivePlayers(room, state)
  const a = alive.findIndex((player) => player.id === fromId)
  const b = alive.findIndex((player) => player.id === toId)
  const diff = Math.abs(a - b)
  return Math.min(diff, alive.length - diff)
}

function useBangCard(state, playerId, index) {
  const card = state.hands[playerId]?.[index]
  if (!card) return null
  state.hands[playerId].splice(index, 1)
  state.discard.push(card)
  return card
}

function applyBang(room, playerId, action) {
  const state = room.state
  if (action.type === 'startBang' && playerId === room.hostId && state.status === 'setup') {
    if (room.players.length < 4 || room.players.length > 7) return
    const roles = bangRoles(room.players.length)
    state.assignments = {}
    state.hands = {}
    state.hp = {}
    state.maxHp = {}
    room.players.forEach((player, index) => {
      state.assignments[player.id] = roles[index]
      state.hands[player.id] = []
      state.maxHp[player.id] = roles[index] === 'sheriff' ? 5 : 4
      state.hp[player.id] = state.maxHp[player.id]
    })
    state.deadIds = []
    state.deck = shuffle(BANG_DECK)
    state.discard = []
    state.weapons = {}
    state.jailed = {}
    state.dynamiteId = null
    state.pendingShot = null
    state.status = 'playing'
    state.winner = null
    room.players.forEach((player) => bangDraw(state, player.id, 4))
    const sheriff = room.players.find((player) => state.assignments[player.id] === 'sheriff').id
    beginBangTurn(room, state, sheriff)
    return
  }
  if (state.status !== 'playing') {
    if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
    return
  }
  if (action.type === 'bangRespond' && state.pendingShot?.targetId === playerId) {
    const missedIndex = state.hands[playerId].indexOf('missed')
    if (action.useMissed && missedIndex >= 0) useBangCard(state, playerId, missedIndex)
    else bangDamage(room, state, playerId)
    state.pendingShot = null
    return
  }
  if (state.turnId !== playerId || state.pendingShot || state.deadIds.includes(playerId)) return
  if (action.type === 'bangPlay') {
    const index = Number(action.index)
    const card = state.hands[playerId]?.[index]
    const targetId = action.targetId
    if (card === 'bang') {
      if (state.bangPlayed || targetId === playerId || state.deadIds.includes(targetId)) return
      if (bangDistance(room, state, playerId, targetId) > (state.weapons[playerId] || 1)) return
      useBangCard(state, playerId, index)
      state.bangPlayed = true
      state.pendingShot = { fromId: playerId, targetId }
    } else if (card === 'beer') {
      if (state.hp[playerId] >= state.maxHp[playerId]) return
      useBangCard(state, playerId, index)
      state.hp[playerId] += 1
    } else if (card === 'scope') {
      useBangCard(state, playerId, index)
      state.weapons[playerId] = 2
    } else if (card === 'jail') {
      if (!targetId || targetId === playerId || state.assignments[targetId] === 'sheriff' || state.deadIds.includes(targetId)) return
      useBangCard(state, playerId, index)
      state.jailed[targetId] = true
    } else if (card === 'dynamite') {
      if (state.dynamiteId) return
      useBangCard(state, playerId, index)
      state.dynamiteId = playerId
    }
    return
  }
  if (action.type === 'bangEndTurn') beginBangTurn(room, state, nextAlive(room, state, playerId))
  if (action.type === 'resetExtended' && playerId === room.hostId && state.status === 'finished') room.state = { status: 'setup' }
}

export function applyExtendedAction(room, playerId, action) {
  if (room.gameType === 'avalon') return applyAvalon(room, playerId, action)
  if (room.gameType === 'hitler') return applyHitler(room, playerId, action)
  if (room.gameType === 'wink') return applyWink(room, playerId, action)
  if (room.gameType === 'twoRooms') return applyTwoRooms(room, playerId, action)
  if (room.gameType === 'bang') return applyBang(room, playerId, action)
}
