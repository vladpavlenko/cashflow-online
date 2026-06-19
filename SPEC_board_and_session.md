# SPEC: Ігрове поле + Мультиплеєр сесія

## Репо: cashflow-online
## Файли: board.svg, board.js, gm.html, index.html, cards.js

---

## Архітектура ходу — ВАЖЛИВО

```
GM натискає "Хід" поруч з гравцем
  → Firebase: currentTurn = playerKey
    → Гравець бачить активну кнопку "🎲 Кинути кубик"
      → Гравець натискає — кубик кидається на його клієнті
        → Firebase: position оновлюється, клітина визначається
          → Гравець бачить картку і кнопки "Прийняти / Відмовитись"
            → GM бачить результат і рішення гравця в реальному часі
```

Гравець без дозволу GM — кнопка кубика неактивна.
GM не кидає кубик за гравця — тільки дає право ходу.

---

## Firebase структура сесії

```
sessions/
  SESSION_ID/
    status:       'lobby' | 'playing' | 'finished'
    gmName:       'Влад'
    round:        1
    currentTurn:  null | 'player_key'   ← GM встановлює
    lastRoll: {
      playerKey:  'player_key',
      dice:       4,
      position:   7,
      cell: { id, type, label }
    }
    currentCard: {
      playerKey:  'player_key',
      cardType:   'emp' | 'self' | 'startup' | ...
      card:       { ...дані картки }
      drawnAt:    timestamp
    }
    playerDecision: {
      playerKey:  'player_key',
      decision:   'accept' | 'decline'
      ts:         timestamp
    }
    players/
      PLAYER_KEY/
        playerName: 'Марія'
        position:   0-23
        laps:       0
        online:     true
        cash:       500
        incomes:    []
        courses:    []
        trainings:  []
        deals:      []
        loans:      { bankRem:0, microRem:0 }
        exp:        { housing:200, food:120, comm:10, transport:30 }
```

---

## board.js — нові функції

```js
// GM: дати право ходу гравцю
window._fbGrantTurn = async (db, sessionId, playerKey) => {
  await set(ref(db, `sessions/${sessionId}/currentTurn`), playerKey);
  // Скинути попередній результат
  await set(ref(db, `sessions/${sessionId}/lastRoll`), null);
  await set(ref(db, `sessions/${sessionId}/currentCard`), null);
  await set(ref(db, `sessions/${sessionId}/playerDecision`), null);
};

// ГРАВЕЦЬ: кидає кубик сам
window._fbRollDice = async (db, sessionId, playerKey) => {
  // Перевірити що це справді хід цього гравця
  const turnSnap = await get(ref(db, `sessions/${sessionId}/currentTurn`));
  if (turnSnap.val() !== playerKey) return null; // не твій хід

  const dice    = Math.floor(Math.random() * 6) + 1;
  const posSnap = await get(ref(db, `sessions/${sessionId}/players/${playerKey}/position`));
  const oldPos  = posSnap.val() || 0;
  const newPos  = (oldPos + dice) % 24;
  const cell    = BOARD_CELLS[newPos];

  // Оновити позицію
  await set(ref(db, `sessions/${sessionId}/players/${playerKey}/position`), newPos);

  // Перехід раунду якщо перетнули 23 (Получка)
  if (newPos <= oldPos && dice > 0) {
    const rSnap = await get(ref(db, `sessions/${sessionId}/round`));
    await set(ref(db, `sessions/${sessionId}/round`), (rSnap.val() || 1) + 1);
  }

  // Зберегти результат кидка для всіх
  await set(ref(db, `sessions/${sessionId}/lastRoll`), {
    playerKey, dice, position: newPos, cell
  });

  // Забрати право ходу (гравець вже походив)
  await set(ref(db, `sessions/${sessionId}/currentTurn`), null);

  return { dice, newPos, cell };
};

// Підписки
window._fbListenSession = (db, sessionId, callback) => {
  onValue(ref(db, `sessions/${sessionId}`), snap => callback(snap.val()));
};

window._fbListenTurn = (db, sessionId, playerKey, callback) => {
  onValue(ref(db, `sessions/${sessionId}/currentTurn`), snap => {
    callback(snap.val() === playerKey);
  });
};

window._fbListenCard = (db, sessionId, playerKey, callback) => {
  onValue(ref(db, `sessions/${sessionId}/currentCard`), snap => {
    const data = snap.val();
    if (data && data.playerKey === playerKey) callback(data);
  });
};

// Рішення гравця
window._fbPlayerDecision = async (db, sessionId, playerKey, decision) => {
  await set(ref(db, `sessions/${sessionId}/playerDecision`), {
    playerKey, decision, ts: Date.now()
  });
};

// Запис картки (GM обирає тип, картка тягнеться)
window._fbSetCard = async (db, sessionId, playerKey, cardType, card) => {
  await set(ref(db, `sessions/${sessionId}/currentCard`), {
    playerKey, cardType, card, drawnAt: Date.now()
  });
};
```

---

## GM панель (gm.html) — що додати

### Секція "Ігрова сесія" вгорі gm.html

```html
<div id="session-bar">
  <!-- До старту -->
  <div id="session-start">
    <button onclick="startSession()">🎮 Почати нову гру</button>
  </div>

  <!-- Після старту -->
  <div id="session-active" class="hidden">
    <span>Сесія: <strong id="sess-id"></strong></span>
    <span>Раунд: <strong id="sess-round">1</strong></span>
    <span id="current-turn-label"></span>
  </div>
</div>

<!-- Список гравців з кнопками ходу -->
<div id="turn-controls" class="hidden">
  <!-- Заповнюється JS -->
  <!-- Для кожного гравця:
  <div class="player-turn-row">
    <span>Марія · $500 · поз.3</span>
    <button onclick="grantTurn('PLAYER_KEY')">▶ Хід</button>
  </div>
  -->
</div>

<!-- Результат останнього ходу -->
<div id="last-roll-panel" class="hidden">
  <div id="roll-result"></div>     <!-- "Марія кинула 5 → ТРЕНИНГ" -->
  <div id="card-type-buttons">
    <!-- Кнопки для GM обрати тип картки:
         Якщо ДЕЛА → 5 кнопок (Робота на дядю / На себе / Заробіток / Угода / Стартап)
         Якщо ТРЕНИНГ → 2 кнопки (Курс / Тренінг)
         Якщо РАСХОДЫ → автоматично
         Якщо УВОЛЕН / ЛЮБОВЬ / РЕБЕНОК / ПОЛУЧКА → автоматично -->
  </div>
  <div id="player-decision-status"></div>  <!-- "Гравець: Прийняв ✅" -->
</div>

<!-- SVG поле -->
<div id="board-container">
  <!-- board.svg inline або як object -->
</div>
```

### JS для GM:

```js
let _sessionId = null;

async function startSession() {
  _sessionId = generateCode(); // 6 символів
  await set(ref(_db, `sessions/${_sessionId}`), {
    status: 'lobby', gmName: 'GM', round: 1, currentTurn: null
  });
  document.getElementById('sess-id').textContent = _sessionId;
  document.getElementById('session-start').classList.add('hidden');
  document.getElementById('session-active').classList.remove('hidden');
  document.getElementById('turn-controls').classList.remove('hidden');

  // Слухати всю сесію
  window._fbListenSession(_db, _sessionId, onSessionUpdate);
}

function onSessionUpdate(session) {
  if (!session) return;

  // Оновити раунд
  document.getElementById('sess-round').textContent = session.round || 1;

  // Оновити список гравців
  renderTurnControls(session.players || {});

  // Позначити чий хід
  const turnLabel = document.getElementById('current-turn-label');
  turnLabel.textContent = session.currentTurn
    ? `Ходить: ${session.players?.[session.currentTurn]?.playerName}`
    : 'Очікування ходу';

  // Оновити фішки на полі
  updateBoardTokens(session.players || {});

  // Показати результат кидка
  if (session.lastRoll) {
    showRollResult(session.lastRoll, session.players || {});
  }

  // Показати рішення гравця
  if (session.playerDecision) {
    const dec = session.playerDecision;
    document.getElementById('player-decision-status').textContent =
      dec.decision === 'accept' ? '✅ Гравець прийняв' : '❌ Гравець відмовився';
  }
}

function renderTurnControls(players) {
  const el = document.getElementById('turn-controls');
  el.innerHTML = Object.entries(players).map(([key, p]) => `
    <div class="player-turn-row">
      <span>${p.playerName} · $${p.cash || 0} · кл.${p.position || 0}</span>
      <button onclick="grantTurn('${key}')"
              ${p.online === false ? 'disabled' : ''}>
        ▶ Хід
      </button>
    </div>
  `).join('');
}

async function grantTurn(playerKey) {
  await window._fbGrantTurn(_db, _sessionId, playerKey);
  document.getElementById('last-roll-panel').classList.add('hidden');
  document.getElementById('player-decision-status').textContent = '';
}

function showRollResult(roll, players) {
  const panel = document.getElementById('last-roll-panel');
  const name  = players[roll.playerKey]?.playerName || roll.playerKey;
  document.getElementById('roll-result').textContent =
    `${name} кинула ${roll.dice} → ${roll.cell.label} (кл.${roll.position})`;
  panel.classList.remove('hidden');

  // Показати кнопки вибору типу картки
  renderCardTypeButtons(roll.cell, roll.playerKey);
}

function renderCardTypeButtons(cell, playerKey) {
  const el = document.getElementById('card-type-buttons');

  const typeMap = {
    dela:    [
      { type:'emp',     label:'💼 Робота на дядю' },
      { type:'self',    label:'🧑‍💻 На себе' },
      { type:'random',  label:'💰 Випадковий заробіток' },
      { type:'deal',    label:'🤝 Купи-Продай' },
      { type:'startup', label:'🚀 Стартап' },
    ],
    trening: [
      { type:'course',   label:'📖 Курс' },
      { type:'training', label:'🧠 Тренінг' },
    ],
    rashody:  [{ type:'expense', label:'💸 Опять расходы (авто)' }],
    uvolen:   [{ type:'uvolen',  label:'🔥 Уволен (авто)' }],
    lyubov:   [{ type:'lyubov',  label:'💍 Любовь (авто)' }],
    rebenok:  [{ type:'rebenok', label:'👶 Ребенок (авто)' }],
    poluchka: [{ type:'poluchka',label:'🏁 Получка (авто)' }],
  };

  const buttons = typeMap[cell.type] || [];
  el.innerHTML = buttons.map(b => `
    <button onclick="gmSendCard('${b.type}','${playerKey}')">
      ${b.label}
    </button>
  `).join('');
}

async function gmSendCard(cardType, playerKey) {
  const card = drawCard(cardType); // з cards.js
  if (!card && !['uvolen','lyubov','rebenok','poluchka'].includes(cardType)) {
    alert('Колода порожня!'); return;
  }
  await window._fbSetCard(_db, _sessionId, playerKey, cardType, card || {});
}
```

---

## Клієнт гравця (index.html) — що показувати

### UI стани гравця:

```
1. LOBBY    — "Чекаємо початку гри... Код: XXXXXX"
2. WAITING  — "Чекаємо твого ходу..." (кнопка кубика сіра/неактивна)
3. MY_TURN  — "Твій хід!" + активна кнопка "🎲 Кинути кубик"
4. ROLLED   — показує результат: "Ти кинув 4 → ДЕЛА"
5. CARD     — показує картку + кнопки "Прийняти / Відмовитись"
6. WAITING  — повертається до стану 2
```

### JS для гравця:

```js
let _myPlayerKey = null;
let _sessionId   = null;
let _myTurn      = false;

// Приєднатись до сесії
async function joinSession(sessionId, playerName) {
  _sessionId   = sessionId;
  _myPlayerKey = playerName.trim().replace(/[^a-zA-Zа-яА-ЯіІєЄ0-9]/g,'_');

  await window._fbJoinSession(_db, sessionId, _myPlayerKey, playerName);

  // Слухати свій хід
  window._fbListenTurn(_db, sessionId, _myPlayerKey, (isMyTurn) => {
    _myTurn = isMyTurn;
    updateRollButton();
  });

  // Слухати картку для мене
  window._fbListenCard(_db, sessionId, _myPlayerKey, (data) => {
    showMyCard(data.card, data.cardType);
  });

  // Слухати загальний стан
  window._fbListenSession(_db, sessionId, (session) => {
    updatePlayerUI(session);
  });
}

function updateRollButton() {
  const btn = document.getElementById('btn-roll');
  if (_myTurn) {
    btn.disabled  = false;
    btn.textContent = '🎲 Кинути кубик';
    btn.style.background = 'var(--gold)';
    document.getElementById('turn-status').textContent = '⚡ Твій хід!';
  } else {
    btn.disabled  = true;
    btn.textContent = '🎲 Кинути кубик';
    btn.style.background = '';
    document.getElementById('turn-status').textContent = 'Очікуй свого ходу...';
  }
}

async function playerRoll() {
  if (!_myTurn) return;
  const result = await window._fbRollDice(_db, _sessionId, _myPlayerKey);
  if (!result) return;

  document.getElementById('roll-result').textContent =
    `Ти кинув ${result.dice} → ${result.cell.label}`;
  document.getElementById('roll-result').classList.remove('hidden');
  updateRollButton(); // вимкнути кнопку після кидка
}

function showMyCard(card, cardType) {
  const el = document.getElementById('my-card');
  el.innerHTML = formatCardForPlayer(card, cardType);
  el.classList.remove('hidden');
}

async function playerAccept() {
  await window._fbPlayerDecision(_db, _sessionId, _myPlayerKey, 'accept');
  document.getElementById('my-card').classList.add('hidden');
}

async function playerDecline() {
  await window._fbPlayerDecision(_db, _sessionId, _myPlayerKey, 'decline');
  document.getElementById('my-card').classList.add('hidden');
}
```

### HTML кнопки гравця:

```html
<div id="turn-status">Очікуй свого ходу...</div>

<button id="btn-roll" onclick="playerRoll()" disabled>
  🎲 Кинути кубик
</button>

<div id="roll-result" class="hidden"></div>

<div id="my-card" class="hidden">
  <!-- Картка з кнопками -->
</div>
```

---

## board.svg — внутрішнє коло

SVG 600×600, центр 300×300.
24 клітини рівномірно по колу (15° кожна).
Зовнішній радіус: 250px, внутрішній: 145px.

Кольори за типом:
- ДЕЛА    → `#f5a623` (жовтий)
- ТРЕНИНГ → `#60a5fa` (синій)
- РАСХОДЫ → `#ef4444` (червоний)
- УВОЛЕН  → `#dc2626` (темно-червоний)
- ЛЮБОВЬ  → `#c084fc` (фіолетовий)
- РЕБЕНОК → `#22c55e` (зелений)
- ПОЛУЧКА → `#16a34a` (темно-зелений)

Фішки гравців — кола r=10px з ініціалами.
id кожної фішки: `token-PLAYER_KEY` — для оновлення позиції через JS.

Функція у board.js для координат центру клітини:
```js
function getCellCenter(cellId) {
  const angle = (cellId * 15 - 90) * Math.PI / 180; // -90° = старт зверху
  const r = 197; // середній радіус між 145 і 250
  return {
    x: 300 + r * Math.cos(angle),
    y: 300 + r * Math.sin(angle),
  };
}
```

---

## cards.js — початкові дані

Скопіювати з `game_helper.html` (cashflow-ua) масиви:
- `JOBS_EMP` → `CARDS.jobs_employee`
- `JOBS_SELF` → `CARDS.jobs_self`
- `RANDOM_INC` → `CARDS.random_income`
- `STARTUPS` → `CARDS.startups`
- `DEALS` → `CARDS.deals`
- `COURSES` → `CARDS.courses`
- `TRAININGS` → `CARDS.trainings`
- `EXPENSES` (масив чисел) → `CARDS.expenses`

Функція вибору:
```js
function drawCard(type) {
  const deck = CARDS[type];
  if (!deck || deck.length === 0) return null;
  return { ...deck[Math.floor(Math.random() * deck.length)] };
}
```

---

## Порядок реалізації для Claude Code

1. `cards.js` — скопіювати картки з game_helper.html
2. `board.js` — всі Firebase функції і getCellCenter()
3. `board.svg` — SVG коло з 24 клітинами і фішками
4. `gm.html` — секція сесії + turn controls + результат ходу
5. `index.html` — кнопка кубика + картка + рішення
