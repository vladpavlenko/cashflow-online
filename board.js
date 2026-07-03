// Клітини ігрового поля — 24 клітини (відповідають SVG, за годинниковою від 12:00)
const BOARD_CELLS = [
  { id: 0,  type: 'dohody',  label: 'Получка' },
  { id: 1,  type: 'trening', label: 'Тренинг' },
  { id: 2,  type: 'rashody', label: 'Расходы' },
  { id: 3,  type: 'dela',    label: 'Дела' },
  { id: 4,  type: 'lyubov',  label: 'Любовь' },
  { id: 5,  type: 'dela',    label: 'Дела' },
  { id: 6,  type: 'trening', label: 'Тренинг' },
  { id: 7,  type: 'dela',    label: 'Дела' },
  { id: 8,  type: 'rashody', label: 'Расходы' },
  { id: 9,  type: 'dela',    label: 'Дела' },
  { id: 10, type: 'trening', label: 'Тренинг' },
  { id: 11, type: 'dela',    label: 'Дела' },
  { id: 12, type: 'trening', label: 'Тренинг' },
  { id: 13, type: 'dela',    label: 'Дела' },
  { id: 14, type: 'uvolen',  label: 'Уволен' },
  { id: 15, type: 'rashody', label: 'Расходы' },
  { id: 16, type: 'dela',    label: 'Дела' },
  { id: 17, type: 'trening', label: 'Тренинг' },
  { id: 18, type: 'rashody', label: 'Расходы' },
  { id: 19, type: 'dela',    label: 'Дела' },
  { id: 20, type: 'rebenok', label: 'Ребенок' },
  { id: 21, type: 'dela',    label: 'Дела' },
  { id: 22, type: 'trening', label: 'Тренинг' },
  { id: 23, type: 'dela',    label: 'Дела' },
];

function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

function nextPosition(currentPos, steps) {
  return (currentPos + steps) % BOARD_CELLS.length;
}

function getCellAt(pos) {
  return BOARD_CELLS[pos % BOARD_CELLS.length];
}

// ── Координати фішок ─────────────────────────────────────────────────────────
//
// Три набори залежно від стану гри:
//
//  CELL_COORDS          — 24 кл., outer ring of cashflow-board-lap1.png
//                         використовується коли ВСІ гравці на колі 1
//                         (SVG viewBox 0 0 100 100, border-radius:50%)
//
//  CELL_COORDS_RING1_DUAL — 24 кл., inner ring of cashflow-board-lap2.png
//                         використовується для гравців на КОЛІ 1
//                         коли хтось вже перейшов на коло 2
//
//  CELL_COORDS_LAP2     — 70 кл. (ЗАГЛУШКИ, будуть відкалібровані пізніше)
//                         for players on КOLO 2
//                         (SVG viewBox 0 0 100 116, border-radius:8px)

const CELL_COORDS = [
  { x:50.7, y:9.0  },  // 0  ПОЛУЧКА
  { x:61.3, y:10.6 },  // 1  ТРЕНИНГ
  { x:71.1, y:14.9 },  // 2  РАСХОДЫ
  { x:79.5, y:21.5 },  // 3  ДЕЛА
  { x:85.9, y:30.1 },  // 4  ЛЮБОВЬ
  { x:89.8, y:40.1 },  // 5  ДЕЛА
  { x:91.0, y:50.7 },  // 6  ТРЕНИНГ
  { x:89.4, y:61.3 },  // 7  ДЕЛА
  { x:85.1, y:71.1 },  // 8  РАСХОДЫ
  { x:78.5, y:79.5 },  // 9  ДЕЛА
  { x:69.9, y:85.9 },  // 10 ТРЕНИНГ
  { x:59.9, y:89.8 },  // 11 ДЕЛА
  { x:49.3, y:91.0 },  // 12 УВОЛЕН
  { x:38.7, y:89.4 },  // 13 ДЕЛА
  { x:28.9, y:85.1 },  // 14 РАСХОДЫ
  { x:20.5, y:78.5 },  // 15 ДЕЛА
  { x:14.1, y:69.9 },  // 16 ТРЕНИНГ
  { x:10.2, y:59.9 },  // 17 РАСХОДЫ
  { x:9.0,  y:49.3 },  // 18 ДЕЛА
  { x:10.6, y:38.7 },  // 19 ДЕЛА
  { x:14.9, y:28.9 },  // 20 РЕБЕНОК
  { x:21.5, y:20.5 },  // 21 ДЕЛА
  { x:30.1, y:14.1 },  // 22 ТРЕНИНГ
  { x:40.1, y:10.2 },  // 23 ДЕЛА
];

// Inner ring of cashflow-board-lap2.png — for ring1 players in dual-board mode
const CELL_COORDS_RING1_DUAL = [
  { x:50.3, y:23.0 },  { x:55.5, y:23.8 },  { x:60.3, y:25.9 },
  { x:64.4, y:29.1 },  { x:67.5, y:33.3 },  { x:69.4, y:38.2 },
  { x:70.0, y:43.3 },  { x:69.2, y:48.5 },  { x:67.1, y:53.3 },
  { x:63.9, y:57.4 },  { x:59.7, y:60.5 },  { x:54.8, y:62.4 },
  { x:49.7, y:63.0 },  { x:44.5, y:62.2 },  { x:39.7, y:60.1 },
  { x:35.6, y:56.9 },  { x:32.5, y:52.7 },  { x:30.6, y:47.8 },
  { x:30.0, y:42.7 },  { x:30.8, y:37.5 },  { x:32.9, y:32.7 },
  { x:36.1, y:28.6 },  { x:40.3, y:25.5 },  { x:45.2, y:23.6 },
];

// Outer ring of cashflow-board-lap2.png — 70 cells, coords TBD (stubs at center)
// index 0 is the starting cell (top-left corner); rest are placeholder until calibrated
const CELL_COORDS_LAP2 = Array.from({ length: 70 }, (_, i) => (
  i === 0 ? { x: 8.5, y: 7.5 } : { x: 50, y: 58 }
));

// dualMode = true when any player has lap === 2
function getCellCenter(cellId, lap, dualMode) {
  if (dualMode && lap === 2) {
    const c = CELL_COORDS_LAP2[cellId % CELL_COORDS_LAP2.length];
    return { xPct: c.x, yPct: c.y };
  }
  if (dualMode && lap !== 2) {
    const c = CELL_COORDS_RING1_DUAL[cellId % 24];
    return { xPct: c.x, yPct: c.y };
  }
  const c = CELL_COORDS[cellId % 24];
  return { xPct: c.x, yPct: c.y };
}

// ── Token rendering ──────────────────────────────────────────
const _TOKEN_COLORS = ['#f5a623','#60a5fa','#c084fc','#22c55e','#ef4444','#fb923c','#f472b6','#34d399'];

function updateBoardTokens(players) {
  const svg = document.getElementById('board-svg');
  if (!svg) return;
  const group = svg.getElementById ? svg.getElementById('board-tokens')
                                   : svg.querySelector('#board-tokens');
  if (!group) return;

  const keys = Object.keys(players || {});
  const anyOnLap2 = keys.some(k => (players[k].lap || 1) === 2);

  // Switch board image, shape and viewBox based on active ring
  const img1 = document.getElementById('board-img-lap1');
  const img2 = document.getElementById('board-img-lap2');
  const wrap = document.getElementById('board-wrap');
  if (img1 && img2) {
    img1.style.opacity = anyOnLap2 ? '0' : '1';
    img1.style.borderRadius = '50%';
    img2.style.opacity = anyOnLap2 ? '1' : '0';
    img2.style.borderRadius = '8px';
  }
  if (wrap) wrap.style.aspectRatio = anyOnLap2 ? '507 / 587' : '1 / 1';
  svg.setAttribute('viewBox', anyOnLap2 ? '0 0 100 116' : '0 0 100 100');

  const r        = anyOnLap2 ? '1.8' : '3.2';
  const fontSize = anyOnLap2 ? '1.4' : '2.4';
  const strokeW  = anyOnLap2 ? '0.4' : '0.6';

  // Remove stale tokens
  Array.from(group.children).forEach(el => {
    const key = el.id.replace('token-', '');
    if (!players[key]) group.removeChild(el);
  });

  keys.forEach((key, idx) => {
    const p   = players[key];
    const lap = p.lap || 1;
    const pos = getCellCenter(p.position || 0, lap, anyOnLap2);

    // Offset tokens sharing the same cell on the same lap
    const sameCellCount = keys.slice(0, idx).filter(k =>
      players[k].position === p.position && (players[k].lap || 1) === lap
    ).length;
    const ox = sameCellCount * (anyOnLap2 ? 2.5 : 4);

    let tokenG = group.querySelector(`#token-${CSS.escape(key)}`);
    if (!tokenG) {
      const NS = 'http://www.w3.org/2000/svg';
      tokenG = document.createElementNS(NS, 'g');
      tokenG.id = `token-${key}`;

      const circ = document.createElementNS(NS, 'circle');
      circ.setAttribute('fill', _TOKEN_COLORS[idx % _TOKEN_COLORS.length]);
      circ.setAttribute('stroke', 'white');

      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('fill', 'white');
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'DM Sans, sans-serif');
      txt.textContent = (p.playerName || key).charAt(0).toUpperCase();

      tokenG.appendChild(circ);
      tokenG.appendChild(txt);
      group.appendChild(tokenG);
    } else {
      const circ = tokenG.querySelector('circle');
      if (circ) circ.setAttribute('fill', _TOKEN_COLORS[idx % _TOKEN_COLORS.length]);
      const txt = tokenG.querySelector('text');
      if (txt) txt.textContent = (p.playerName || key).charAt(0).toUpperCase();
    }

    // Update size attrs every render (they change when board switches)
    const circ = tokenG.querySelector('circle');
    circ.setAttribute('r', r);
    circ.setAttribute('stroke-width', strokeW);
    const txt = tokenG.querySelector('text');
    txt.setAttribute('font-size', fontSize);
    txt.setAttribute('y', (parseFloat(r) * 0.34).toFixed(2));

    tokenG.setAttribute('transform', `translate(${(pos.xPct + ox).toFixed(2)}, ${pos.yPct.toFixed(2)})`);
  });
}

// ── Firebase helpers (board.js uses window._fb* set by HTML modules) ──

window._fbJoinSession = async (db, sessionId, playerKey, playerName) => {
  await window._fbSet(window._fbRef(db, `sessions/${sessionId}/players/${playerKey}`), {
    playerName,
    position: 0,
    lap: 1,
    laps: 0,
    hasMovedOnce: false,
    round: 1,
    online: true,
    cash: 500,
    hasPartner: false,
    kidsCount: 0,
    incomes: [],
    courses: [],
    trainings: [],
    deals: [],
    loans:  { bankRem: 0, microRem: 0 },
    exp:    { housing: 200, food: 120, comm: 10, transport: 30 },
  });
};

window._fbGrantTurn = async (db, sessionId, playerKey) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}`), {
    currentTurn:     playerKey,
    turnPhase:       'rolling',
    lastRoll:        null,
    cardTypeRequest: null,
    currentCard:     null,
    playerDecision:  null,
  });
};

window._fbRollDice = async (db, sessionId, playerKey) => {
  const ref = window._fbRef, get = window._fbGet;

  const turnSnap = await get(ref(db, `sessions/${sessionId}/currentTurn`));
  if (turnSnap.val() !== playerKey) return null;

  const dice        = Math.floor(Math.random() * 6) + 1;
  const playerSnap  = await get(ref(db, `sessions/${sessionId}/players/${playerKey}`));
  const player      = playerSnap.val() || {};
  const oldPos      = player.position || 0;
  const newPos      = (oldPos + dice) % 24;
  const cell        = BOARD_CELLS[newPos];
  const crossedFinish = (player.hasMovedOnce === true) && (newPos <= oldPos);

  await window._fbUpdate(ref(db, `sessions/${sessionId}/players/${playerKey}`), {
    position:     newPos,
    hasMovedOnce: true,
  });

  await window._fbUpdate(ref(db, `sessions/${sessionId}`), {
    turnPhase: 'choosing',
    lastRoll:  { playerKey, dice, position: newPos, cell, crossedFinish, ts: Date.now() },
  });

  return { dice, newPos, cell, crossedFinish };
};

window._fbListenSession = (db, sessionId, callback) => {
  window._fbOnValue(window._fbRef(db, `sessions/${sessionId}`), snap => callback(snap.val()));
};

window._fbPlayerDecision = async (db, sessionId, playerKey, decision) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}`), {
    turnPhase:      'done',
    playerDecision: { playerKey, decision, ts: Date.now() },
  });
};

window._fbSetCard = async (db, sessionId, playerKey, cardType, card) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}`), {
    turnPhase:       'deciding',
    currentCard:     { playerKey, cardType, card, drawnAt: Date.now() },
    cardTypeRequest: null,
  });
};

// ── Shared-card helpers (Training / Course cell) ──────────────────────────

window._fbSetSharedCard = async (db, sessionId, cardType, card) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}`), {
    sharedCard: { cardType, card, stage: 'front', decisions: {}, acks: {} },
  });
};

window._fbSharedCardDecision = async (db, sessionId, playerKey, decision) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}/sharedCard/decisions`), {
    [playerKey]: decision,
  });
};

window._fbSharedCardAck = async (db, sessionId, playerKey) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}/sharedCard/acks`), {
    [playerKey]: true,
  });
};

window._fbSetSharedCardStage = async (db, sessionId, stage) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}/sharedCard`), { stage });
};

window._fbClearSharedCard = async (db, sessionId) => {
  await window._fbUpdate(window._fbRef(db, `sessions/${sessionId}`), {
    sharedCard: null,
    turnPhase:  'done',
  });
};
