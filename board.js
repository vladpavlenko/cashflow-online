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

// Token positions as percentages over the board image (assets/board_real.png),
// measured from its actual pixel layout — cell 0 ("Получка") at 12 o'clock,
// going clockwise in 15° steps around the label ring.
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

function getCellCenter(cellId) {
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

  // Remove stale tokens
  Array.from(group.children).forEach(el => {
    const key = el.id.replace('token-', '');
    if (!players[key]) group.removeChild(el);
  });

  keys.forEach((key, idx) => {
    const p = players[key];
    const pos = getCellCenter(p.position || 0);

    // Offset tokens sharing a cell
    const sameCellCount = keys.slice(0, idx).filter(k => players[k].position === p.position).length;
    const ox = sameCellCount * 4;

    let tokenG = group.querySelector(`#token-${CSS.escape(key)}`);
    if (!tokenG) {
      const NS = 'http://www.w3.org/2000/svg';
      tokenG = document.createElementNS(NS, 'g');
      tokenG.id = `token-${key}`;

      const circ = document.createElementNS(NS, 'circle');
      circ.setAttribute('r', '3.5');
      circ.setAttribute('fill', _TOKEN_COLORS[idx % _TOKEN_COLORS.length]);
      circ.setAttribute('stroke', 'white');
      circ.setAttribute('stroke-width', '0.8');

      const txt = document.createElementNS(NS, 'text');
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('y', '1.2');
      txt.setAttribute('fill', 'white');
      txt.setAttribute('font-size', '2.5');
      txt.setAttribute('font-weight', '700');
      txt.setAttribute('font-family', 'DM Sans, sans-serif');
      txt.textContent = (p.playerName || key).charAt(0).toUpperCase();

      tokenG.appendChild(circ);
      tokenG.appendChild(txt);
      group.appendChild(tokenG);
    } else {
      // Update initial colour if idx changed
      const circ = tokenG.querySelector('circle');
      if (circ) circ.setAttribute('fill', _TOKEN_COLORS[idx % _TOKEN_COLORS.length]);
      const txt = tokenG.querySelector('text');
      if (txt) txt.textContent = (p.playerName || key).charAt(0).toUpperCase();
    }

    tokenG.setAttribute('transform', `translate(${(pos.xPct + ox).toFixed(2)}, ${pos.yPct.toFixed(2)})`);
  });
}

// ── Firebase helpers (board.js uses window._fb* set by HTML modules) ──

window._fbJoinSession = async (db, sessionId, playerKey, playerName) => {
  await window._fbSet(window._fbRef(db, `sessions/${sessionId}/players/${playerKey}`), {
    playerName,
    position: 0,
    laps: 0,
    hasMovedOnce: false,
    round: 1,
    online: true,
    cash: 500,
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
