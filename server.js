import { createServer } from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const PORT = Number(process.argv[2] || process.env.PORT || 80)
const PUBLIC_DIR = join(process.cwd(), 'dist')
const rooms = new Map()

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
}

function id() {
  return Math.random().toString(36).slice(2, 10)
}

function code() {
  let value = ''
  do value = Math.random().toString(36).slice(2, 8).toUpperCase()
  while (rooms.has(value))
  return value
}

function json(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

async function body(req) {
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function baseRoom(room, viewerId) {
  return {
    code: room.code,
    hostId: room.hostId,
    gameType: room.gameType,
    players: room.players,
    state: publicState(room, viewerId),
  }
}

function publicState(room, viewerId) {
  const state = room.state || {}
  if (room.gameType === 'imposter' && state.assignments) {
    return {
      ...state,
      assignments: undefined,
      imposterIds: state.status === 'result' ? state.imposterIds : undefined,
      me: state.assignments[viewerId] || null,
    }
  }
  if (room.gameType === 'number' && state.secrets) {
    const finished = state.status === 'finished'
    const ready = {}
    for (const player of room.players) ready[player.id] = Boolean(state.secrets[player.id])
    return {
      ...state,
      secrets: undefined,
      ready,
      mySecret: state.secrets[viewerId] || '',
      opponentSecrets: finished ? state.secrets : undefined,
    }
  }
  if (room.gameType === 'planes' && state.planes) {
    const planes = {}
    for (const player of room.players) {
      planes[player.id] = player.id === viewerId || state.status === 'finished' ? state.planes[player.id] || [] : []
    }
    return { ...state, planes }
  }
  return state
}

function broadcast(room) {
  for (const client of room.clients) {
    sendEvent(client, 'room', baseRoom(room, client.viewerId))
  }
}

function sendEvent(client, event, payload) {
  client.res.write(`event: ${event}\n`)
  client.res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

function cleanRooms() {
  const cutoff = Date.now() - 1000 * 60 * 60 * 8
  for (const [roomCode, room] of rooms) {
    if (room.updatedAt < cutoff) rooms.delete(roomCode)
  }
}

function ensureRoom(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) throw new Error('Room not found')
  room.updatedAt = Date.now()
  return room
}

function setGame(room, gameType) {
  room.gameType = gameType
  if (gameType === 'imposter') {
    room.state = { status: 'setup', votes: {}, round: 0 }
  } else if (gameType === 'number') {
    room.state = { status: 'setup', secrets: {}, attempts: [], turnId: null, winnerId: null }
  } else if (gameType === 'planes') {
    room.state = { status: 'placement', planeCount: 1, planeProposal: null, planes: {}, shots: [], ready: {}, eliminated: {}, turnId: null, winnerId: null }
  }
}

function removePlayer(room, playerId) {
  room.players = room.players.filter((player) => player.id !== playerId)
  if (room.players.length === 0) {
    rooms.delete(room.code)
    return
  }
  if (room.hostId === playerId) room.hostId = room.players[0].id
  // Removing a player can otherwise leave turns, votes, or hidden assignments
  // pointing to someone who is no longer in the room.
  setGame(room, room.gameType)
}

function canSwitchGame(room) {
  const status = room.state?.status
  if (!status) return true
  if (room.gameType === 'imposter') return status === 'setup' || status === 'result'
  if (room.gameType === 'number') return status === 'setup' || status === 'finished'
  if (room.gameType === 'planes') return status === 'placement' || status === 'finished'
  return true
}

function score(secret, guess) {
  let alpha = 0
  const a = []
  const b = []
  for (let i = 0; i < 4; i += 1) {
    if (secret[i] === guess[i]) alpha += 1
    else {
      a.push(secret[i])
      b.push(guess[i])
    }
  }
  let betta = 0
  for (const digit of b) {
    const at = a.indexOf(digit)
    if (at >= 0) {
      betta += 1
      a.splice(at, 1)
    }
  }
  return { alpha, betta }
}

const PLANE = [
  [1, 0],
  [0, 1], [1, 1], [2, 1],
  [1, 2],
  [0, 3], [1, 3], [2, 3],
]

function rotateCells(rotation) {
  let cells = PLANE.map(([x, y]) => ({ x, y }))
  for (let angle = 0; angle < rotation; angle += 90) {
    cells = cells.map(({ x, y }) => ({ x: -y, y: x }))
    const minX = Math.min(...cells.map((cell) => cell.x))
    const minY = Math.min(...cells.map((cell) => cell.y))
    cells = cells.map(({ x, y }) => ({ x: x - minX, y: y - minY }))
  }
  return cells
}

function planeCells(plane) {
  return rotateCells(plane.rotation || 0).map((cell, i) => ({ x: plane.x + cell.x, y: plane.y + cell.y, head: i === 0 }))
}

function playerIndex(room, playerId) {
  return room.players.findIndex((p) => p.id === playerId)
}

function activePlayers(room, state) {
  return room.players.filter((p) => !state.eliminated?.[p.id])
}

function nextTurn(room, state, currentId) {
  const active = activePlayers(room, state)
  if (active.length <= 1) return null
  const start = Math.max(0, playerIndex(room, currentId))
  for (let offset = 1; offset <= room.players.length; offset += 1) {
    const candidate = room.players[(start + offset) % room.players.length]
    if (candidate && !state.eliminated?.[candidate.id]) return candidate.id
  }
  return active[0]?.id || null
}

function hasPlaneOverlap(planes) {
  const occupied = new Set()
  for (const plane of planes) {
    for (const cell of planeCells(plane)) {
      const key = `${cell.x}:${cell.y}`
      if (occupied.has(key)) return true
      occupied.add(key)
    }
  }
  return false
}

function resetPlanesState(state) {
  state.status = 'placement'
  state.planeProposal = null
  state.planes = {}
  state.shots = []
  state.ready = {}
  state.eliminated = {}
  state.turnId = null
  state.winnerId = null
}

function applyAction(room, playerId, action) {
  const state = room.state
  if (action.type === 'selectGame') {
    if (playerId !== room.hostId || !canSwitchGame(room)) return
    setGame(room, action.gameType)
    return
  }
  if (room.gameType === 'imposter') {
    if (action.type === 'startImposter') {
      state.status = 'discussion'
      state.round = (state.round || 0) + 1
      state.word = action.word
      state.hint = action.hint
      state.assignments = action.assignments
      state.imposterIds = Array.isArray(action.imposterIds) ? action.imposterIds : []
      state.starterId = action.starterId
      state.votes = {}
      return
    }
    if (action.type === 'vote') {
      state.votes[playerId] = action.targetId
      if (Object.keys(state.votes).length >= room.players.length) state.status = 'result'
      return
    }
    if (action.type === 'reveal') {
      state.status = 'result'
      return
    }
    if (action.type === 'reset') {
      state.status = 'setup'
      state.votes = {}
      state.imposterIds = []
      return
    }
  }
  if (room.gameType === 'number') {
    if (action.type === 'setSecret' && /^\d{4}$/.test(action.code)) {
      state.secrets[playerId] = action.code
      if (room.players.length >= 2 && room.players.every((p) => state.secrets[p.id])) {
        state.status = 'playing'
        state.turnId = room.players[Math.floor(Math.random() * room.players.length)].id
      }
      return
    }
    if (action.type === 'guess' && state.status === 'playing' && state.turnId === playerId && /^\d{4}$/.test(action.code)) {
      const targets = room.players.filter((p) => p.id !== playerId && state.secrets[p.id])
      const target = targets.find((p) => p.id === action.targetId) || targets[0]
      if (!target) return
      const result = score(state.secrets[target.id], action.code)
      state.attempts.push({ id: id(), playerId, targetId: target.id, guess: action.code, ...result })
      if (result.alpha === 4) {
        state.status = 'finished'
        state.winnerId = playerId
        state.turnId = null
      } else {
        const idx = room.players.findIndex((p) => p.id === playerId)
        state.turnId = room.players[(idx + 1) % room.players.length].id
      }
      return
    }
    if (action.type === 'reset') {
      room.state = { status: 'setup', secrets: {}, attempts: [], turnId: null, winnerId: null }
      return
    }
  }
  if (room.gameType === 'planes') {
    if (action.type === 'proposePlaneCount') {
      const count = Math.max(1, Math.min(5, Number(action.count) || 1))
      state.planeProposal = { count, proposedBy: playerId, approvals: [playerId] }
      return
    }
    if (action.type === 'approvePlaneCount' && state.planeProposal) {
      if (!state.planeProposal.approvals.includes(playerId)) state.planeProposal.approvals.push(playerId)
      if (state.planeProposal.approvals.length > room.players.length / 2) {
        state.planeCount = state.planeProposal.count
        resetPlanesState(state)
      }
      return
    }
    if (action.type === 'cancelPlaneProposal' && state.planeProposal?.proposedBy === playerId) {
      state.planeProposal = null
      return
    }
    if (action.type === 'placePlane') {
      if (state.status !== 'placement') return
      const plane = { x: Number(action.x), y: Number(action.y), rotation: Number(action.rotation || 0) }
      const cells = planeCells(plane)
      if (cells.every((cell) => cell.x >= 1 && cell.x <= 10 && cell.y >= 1 && cell.y <= 10)) {
        const current = state.planes[playerId] || []
        const index = Math.max(0, Math.min(state.planeCount - 1, Number.isFinite(Number(action.index)) ? Number(action.index) : current.length))
        const next = current.slice(0, state.planeCount)
        next[index] = plane
        if (!hasPlaneOverlap(next.filter(Boolean))) {
          state.planes[playerId] = next.filter(Boolean)
          state.ready[playerId] = false
        }
      }
      return
    }
    if (action.type === 'ready') {
      if ((state.planes[playerId]?.length || 0) >= state.planeCount) state.ready[playerId] = true
      if (room.players.length >= 2 && room.players.every((p) => state.ready[p.id])) {
        state.status = 'playing'
        state.eliminated = {}
        state.turnId = room.players[Math.floor(Math.random() * room.players.length)].id
      }
      return
    }
    if (action.type === 'fire' && state.status === 'playing' && state.turnId === playerId) {
      if (state.eliminated?.[playerId]) return
      const target = room.players.find((p) => p.id === action.targetId && p.id !== playerId && !state.eliminated?.[p.id] && state.planes[p.id]?.length)
      if (!target) return
      if (state.shots.some((shot) => shot.playerId === playerId && shot.targetId === target.id && shot.x === Number(action.x) && shot.y === Number(action.y))) return
      const cells = state.planes[target.id].flatMap((plane, planeIndex) => planeCells(plane).map((cell) => ({ ...cell, planeIndex })))
      const hit = cells.find((cell) => cell.x === Number(action.x) && cell.y === Number(action.y))
      state.shots.push({ playerId, targetId: target.id, x: Number(action.x), y: Number(action.y), result: hit?.head ? 'head' : hit ? 'hit' : 'miss', planeIndex: hit?.planeIndex ?? null })
      const sunkHeads = new Set(
        state.shots
          .filter((shot) => shot.targetId === target.id && shot.result === 'head')
          .map((shot) => shot.planeIndex),
      )
      if (sunkHeads.size >= state.planeCount) state.eliminated[target.id] = true
      const active = activePlayers(room, state)
      if (active.length === 1) {
        state.status = 'finished'
        state.winnerId = active[0].id
        state.turnId = null
      } else {
        state.turnId = nextTurn(room, state, playerId)
      }
      return
    }
    if (action.type === 'reset') {
      resetPlanesState(state)
    }
  }
}

async function api(req, res, url) {
  try {
    if (req.method === 'POST' && url.pathname === '/api/rooms') {
      cleanRooms()
      const data = await body(req)
      const player = { id: id(), name: String(data.name || 'Player').slice(0, 24) }
      const room = { code: code(), hostId: player.id, players: [player], gameType: 'imposter', state: {}, clients: new Set(), updatedAt: Date.now() }
      setGame(room, 'imposter')
      rooms.set(room.code, room)
      json(res, 201, { room: baseRoom(room, player.id), playerId: player.id })
      return
    }
    const match = /^\/api\/rooms\/([A-Z0-9]+)(?:\/(join|action|events))?$/.exec(url.pathname)
    if (!match) return json(res, 404, { error: 'Not found' })
    const room = ensureRoom(match[1])
    const op = match[2]
    if (req.method === 'POST' && op === 'join') {
      const data = await body(req)
      let player = room.players.find((p) => p.id === data.playerId)
      if (!player) {
        player = { id: id(), name: String(data.name || 'Player').slice(0, 24) }
        room.players.push(player)
      }
      broadcast(room)
      return json(res, 200, { room: baseRoom(room, player.id), playerId: player.id })
    }
    if (req.method === 'POST' && op === 'action') {
      const data = await body(req)
      if (!room.players.some((p) => p.id === data.playerId)) return json(res, 403, { error: 'Player not in room' })
      if (data.type === 'leave') {
        removePlayer(room, data.playerId)
        room.updatedAt = Date.now()
        broadcast(room)
        return json(res, 200, { left: true })
      }
      if (data.type === 'signal') {
        for (const client of room.clients) {
          if (client.viewerId === data.targetId) {
            sendEvent(client, 'signal', {
              fromId: data.playerId,
              signal: data.signal,
            })
          }
        }
        return json(res, 200, { room: baseRoom(room, data.playerId) })
      }
      applyAction(room, data.playerId, data)
      room.updatedAt = Date.now()
      broadcast(room)
      return json(res, 200, { room: baseRoom(room, data.playerId) })
    }
    if (req.method === 'GET' && op === 'events') {
      const viewerId = url.searchParams.get('playerId')
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-store',
        Connection: 'keep-alive',
      })
      const client = { res, viewerId }
      room.clients.add(client)
      sendEvent(client, 'room', baseRoom(room, viewerId))
      req.on('close', () => room.clients.delete(client))
      return
    }
    if (req.method === 'GET') {
      const viewerId = url.searchParams.get('playerId') || room.hostId
      return json(res, 200, { room: baseRoom(room, viewerId) })
    }
    json(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    json(res, 400, { error: err instanceof Error ? err.message : 'Bad request' })
  }
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname)
  if (pathname === '/') pathname = '/index.html'
  const candidate = normalize(join(PUBLIC_DIR, pathname))
  const file = candidate.startsWith(PUBLIC_DIR) && existsSync(candidate) ? candidate : join(PUBLIC_DIR, 'index.html')
  res.writeHead(200, {
    'Content-Type': mime[extname(file)] || 'application/octet-stream',
    'Cache-Control': file.includes(`${join(PUBLIC_DIR, 'assets')}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
  })
  createReadStream(file).pipe(res)
}

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
  if (url.pathname.startsWith('/api/')) void api(req, res, url)
  else void serveStatic(req, res, url)
}).listen(PORT, '0.0.0.0', () => {
  console.log(`Imposter server listening on ${PORT}`)
})
