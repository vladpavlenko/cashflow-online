const CARDS = {
  emp: [
    {name:"Кур'єр",              pay:120, req:[]},
    {name:'Касир',               pay:150, req:[]},
    {name:'Вантажник',           pay:130, req:[]},
    {name:'Продавець',           pay:170, req:[]},
    {name:'Оператор call-центру',pay:200, req:[]},
    {name:'Адміністратор',       pay:230, req:['Гуманітарна освіта']},
    {name:'Бухгалтер',           pay:360, req:['Економічна освіта']},
    {name:'Юрист',               pay:420, req:['Юридична освіта']},
    {name:'Менеджер проєктів',   pay:380, req:['Економічна освіта']},
    {name:'Java-розробник',      pay:480, req:['Курс Java']},
    {name:'JS-розробник',        pay:440, req:['Курс JS']},
    {name:'Python-розробник',    pay:460, req:['Курс Python']},
    {name:'Психолог',            pay:290, req:['Психологічна освіта']},
    {name:'Механік СТО',         pay:310, req:['Спеціальність: Автомеханік']},
    {name:'Кухар ресторану',     pay:260, req:['Спеціальність: Кухар']},
    {name:'Електрик',            pay:330, req:['Спеціальність: Електрик']},
    {name:'Будівельник',         pay:280, req:['Спеціальність: Будівельник']},
  ],
  self: [
    {name:'Фріланс-дизайн',         pay:320, req:[]},
    {name:'Репетитор',              pay:260, req:[]},
    {name:'Масажист',               pay:370, req:['Курс масажу']},
    {name:'Майстер манікюру',       pay:290, req:['Курс краси']},
    {name:'Приватний перевізник',   pay:420, req:['Права водія']},
    {name:'Фріланс-програміст',     pay:650, req:['Курс Java або JS']},
    {name:'Веб-розробник',          pay:530, req:['Курс JS або HTML/CSS']},
    {name:'Приватний юрист',        pay:720, req:['Юридична освіта']},
    {name:'Фотограф-фрілансер',     pay:340, req:[]},
    {name:'Ремонт авто вдома',      pay:510, req:['Спеціальність: Автомеханік']},
    {name:'Приватний електрик',     pay:480, req:['Спеціальність: Електрик']},
  ],
  random: [
    {name:"Підробіток кур'єром",      amount:60,  req:[]},
    {name:'Здав непотрібні речі',     amount:90,  req:[]},
    {name:'Виграш у лотерею',         amount:130, req:[]},
    {name:'Підробіток у кафе',        amount:70,  req:[]},
    {name:'Виконав разове замовлення',amount:110, req:[]},
    {name:'Продав на OLX',            amount:160, req:[]},
    {name:'Повернули старий борг',    amount:100, req:[]},
    {name:'Знайшов гаманець (нагорода)',amount:50, req:[]},
    {name:'Підробіток водієм',        amount:190, req:['Права водія']},
    {name:'Ремонт сусідам',           amount:210, req:['Спеціальність: Електрик']},
    {name:'Разова фотосесія',         amount:150, req:[]},
    {name:'Фріланс-задача',           amount:200, req:['Курс JS або Java']},
  ],
  startup: [
    {name:'Вендинговий автомат', invest:2000,  pct:0.08, req:[]},
    {name:'Фотостудія',          invest:3000,  pct:0.06, req:[]},
    {name:'Майстерня з ремонту', invest:2500,  pct:0.07, req:['Спеціальність: Механік або Електрик']},
    {name:'Онлайн-магазин',      invest:1800,  pct:0.09, req:[]},
    {name:"Кав'ярня",            invest:8000,  pct:0.06, req:[]},
    {name:'IT-стартап',          invest:5000,  pct:0.10, req:['Курс Java або JS']},
    {name:'Салон краси',         invest:6000,  pct:0.07, req:['Курс краси або масажу']},
    {name:'Автомийка',           invest:9000,  pct:0.05, req:[]},
    {name:'Хостел',              invest:14000, pct:0.06, req:[]},
    {name:'СТО',                 invest:11000, pct:0.07, req:['Спеціальність: Автомеханік']},
    {name:'Ресторан',            invest:18000, pct:0.05, req:['Спеціальність: Кухар']},
    {name:'Програмний продукт',  invest:5500,  pct:0.12, req:['Курс Java або JS']},
    {name:'Блог / YouTube',      invest:800,   pct:0.15, req:[]},
    {name:'Великий бізнес',      invest:32000, pct:0.08, req:[]},
  ],
  deal: [
    {name:'Перепродаж смартфону',        invest:500,  mult:2.2, term:3, req:[]},
    {name:'Перепродаж авто',             invest:2500, mult:1.8, term:4, req:['Спеціальність: Автомеханік']},
    {name:'Товар з Китаю',               invest:1500, mult:2.5, term:4, req:[]},
    {name:'Криптовалюта',                invest:1000, mult:2.0, term:3, req:[]},
    {name:'Перепродаж нерухомості',      invest:5000, mult:1.6, term:5, req:[]},
    {name:'Оптова партія одягу',         invest:2000, mult:2.3, term:4, req:[]},
    {name:'Ремонт і перепродаж техніки', invest:700,  mult:2.8, term:3, req:['Спеціальність: Електрик або Механік']},
    {name:'Бізнес з Китаєм',             invest:3000, mult:2.0, term:4, req:['Курс: Бізнес з Китаєм']},
  ],
  course: [
    {name:'Курс Java (базовий)',           cost:400, field:'Java',        effect:'Дає доступ до роботи Java-розробника'},
    {name:'Курс JavaScript',               cost:350, field:'JS',          effect:'Дає доступ до роботи JS-розробника і фрілансу'},
    {name:'Курс Python',                   cost:350, field:'Python',      effect:'Дає доступ до роботи Python-розробника'},
    {name:'Курс HTML/CSS/Web',             cost:280, field:'Веб',         effect:'+$300 до доходу веб-фрілансера'},
    {name:'Курс масажу',                   cost:300, field:'Краса',       effect:'+$300 до доходу у сфері Краса'},
    {name:'Курс манікюру',                 cost:250, field:'Краса',       effect:'+$200 до доходу у сфері Краса'},
    {name:'Курс англійської (базовий)',    cost:200, field:'Англійська',  effect:'Відкриває вакансії з вимогою Англійська'},
    {name:'Курс англійської (просунутий)',cost:350, field:'Англійська',  effect:'+$400 до доходу при роботі з іноземними клієнтами'},
    {name:'Курс вождіння (кат. B)',        cost:500, field:'Вождіння',    effect:'Дає права водія. Відкриває вакансії перевізника'},
    {name:'Курс бухобліку',                cost:300, field:'Бухгалтерія', effect:'+$200 до доходу бухгалтера'},
    {name:'Курс бізнесу з Китаєм',         cost:400, field:'Китай',       effect:'Відкриває угоду "Бізнес з Китаєм"'},
    {name:'SMM і соцмережі',               cost:250, field:'Маркетинг',   effect:'+$200 до доходу маркетолога або фрілансера'},
  ],
  training: [
    {name:'Тайм-менеджмент',    cost:150, effect:'Марний. Ти навчився керувати часом. Ніякого бонусу.',  mult:0,    applyTo:null},
    {name:'Лідерство',          cost:200, effect:'Марний. Ти став лідером. Ніякого бонусу.',             mult:0,    applyTo:null},
    {name:'Мислення багатого',  cost:300, effect:'Марний. Ти думаєш як багатий. Але бонусів немає.',     mult:0,    applyTo:null},
    {name:'Управління людьми',  cost:250, effect:'+15% до доходу від роботи на дядю',                    mult:0.15, applyTo:'employee'},
    {name:'Продуктивність',     cost:350, effect:'+20% до всіх активних доходів',                        mult:0.20, applyTo:'both'},
    {name:'Переговори і продажі',cost:300, effect:'+10% до доходу від роботи на себе',                   mult:0.10, applyTo:'self'},
    {name:'Управління проєктами',cost:280, effect:'+12% до доходу від роботи на дядю',                  mult:0.12, applyTo:'employee'},
    {name:'Фінансова грамотність',cost:200,effect:'+5% до всіх доходів',                                mult:0.05, applyTo:'both'},
  ],
  expense: [20,30,50,50,70,80,80,100,100,120,150,150,200,200,300,300,500].map(a => ({amount: a})),
};

function parseCardsText(rawText) {
  const blocks = rawText.split(/^---\s*$/m).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const card = {};
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim().toUpperCase();
      const val = line.slice(idx + 1).trim();
      if (key === 'NAME')   card.name   = val;
      if (key === 'PAY')    card.pay    = parseFloat(val) || 0;
      if (key === 'BONUS')  card.bonus  = val;
      if (key === 'REQ')    card.req    = (val === '-' ? [] : val.split(',').map(s => s.trim()));
      if (key === 'TEXT')   card.text   = val;
      if (key === 'IMAGE')  card.image  = val;
      if (key === 'COST')   card.cost   = parseFloat(val) || 0;
      if (key === 'INVEST') card.invest = parseFloat(val) || 0;
      if (key === 'TERM')   card.term   = parseFloat(val) || 0;
      if (key === 'EFFECT') card.effect = val;
      if (key === 'FIELD')  card.field  = val;
    });
    return card;
  }).filter(c => c.name);
}

function parseJobsSelfCards(rawText) {
  const blocks = rawText.split(/^---\s*$/m).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const card = {};
    lines.forEach(line => {
      const idx = line.indexOf(':');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim().toUpperCase();
      const val = line.slice(idx + 1).trim();
      if (key === 'NAME')            card.name           = val;
      if (key === 'INDUSTRY')        card.industry        = val;
      if (key === 'PAY')             card.pay             = parseFloat(val) || 0;
      if (key === 'REQ')             card.req             = (val === '-' ? [] : val.split(',').map(s => s.trim()));
      if (key === 'ADDITIONAL_COST') card.additionalCost  = (val === '-' ? null : val);
      if (key === 'IMAGE')           card.image           = val;
      if (key === 'TEXT')            card.text            = val;
    });
    return card;
  }).filter(c => c.name);
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const _TYPE_TO_LS = {
  emp: 'jobs_employee', self: 'jobs_self', random: 'random_income',
  startup: 'startups', deal: 'deals', course: 'courses',
  training: 'trainings', expense: 'expenses',
};

function drawCard(type) {
  const lsType = _TYPE_TO_LS[type] || type;

  // Priority 1: cards_data.js permanent file
  const fromFile = window.LOCAL_CARDS?.[lsType];

  // Priority 2: localStorage (manual import)
  const fromStorage = (() => {
    const raw = localStorage.getItem(`cf_cards_${lsType}`);
    return raw ? JSON.parse(raw) : null;
  })();

  const allCards = (fromFile && fromFile.length > 0) ? fromFile
                 : (fromStorage && fromStorage.length > 0) ? fromStorage
                 : (CARDS[type] || []);

  if (allCards.length === 0) return null;

  let deckRaw = localStorage.getItem(`cf_deck_${lsType}`);
  let deck = deckRaw ? JSON.parse(deckRaw) : [];

  if (deck.length === 0) {
    deck = shuffleArray(allCards.map((_, i) => i));
    console.log(`♻️ Колода "${type}" вичерпана — перетасовано заново`);
  }

  const cardIndex = deck.pop();
  localStorage.setItem(`cf_deck_${lsType}`, JSON.stringify(deck));

  const card = { ...allCards[cardIndex] };
  card._deckRemaining = deck.length;
  card._deckTotal     = allCards.length;

  return card;
}

function _availableCardCount(type) {
  const lsType = _TYPE_TO_LS[type] || type;
  const fromFile    = window.LOCAL_CARDS?.[lsType];
  const fromStorage = (() => {
    const raw = localStorage.getItem(`cf_cards_${lsType}`);
    return raw ? JSON.parse(raw) : null;
  })();
  return (fromFile && fromFile.length > 0) ? fromFile.length
       : (fromStorage && fromStorage.length > 0) ? fromStorage.length
       : (CARDS[type] || []).length;
}

// Draws for the shared "trening" board cell, which can land on either a course
// or a training. Picks the type weighted by each deck's size (matching the old
// "combine both decks into one pool" behavior) then draws via drawCard() so the
// usual LOCAL_CARDS/localStorage/CARDS-stub priority and no-repeat shuffling apply.
window.drawTreningCard = function() {
  const courseCount   = _availableCardCount('course');
  const trainingCount = _availableCardCount('training');
  const total = courseCount + trainingCount;
  if (total === 0) return null;
  const cardType = Math.random() * total < courseCount ? 'course' : 'training';
  const card = drawCard(cardType);
  return card ? { cardType, card } : null;
};

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// Turns one req entry (string, or {anyOf:[...]}/{allOf:[...]}) into a display label.
function reqLabel(r) {
  if (typeof r === 'string') return r;
  if (r && r.anyOf) return '(' + r.anyOf.map(reqLabel).join(' або ') + ')';
  if (r && r.allOf) return '(' + r.allOf.map(reqLabel).join(' і ') + ')';
  return '';
}

// card.bonus on jobs_employee cards is dual-purpose text from the source data:
// a flat "$" addition to pay ("+300$ (за слитое дизельное топливо)") that isn't
// mentioned anywhere else, OR a conditional "%" pay multiplier ("+50% if has
// course: X") whose condition is already spelled out in card.text. Only the
// flat-dollar form needs its own display line; the percent form would duplicate
// what's already in the main text.
function isFlatMoneyBonus(bonus) {
  return typeof bonus === 'string' && bonus.includes('$') && !bonus.includes('%');
}

// Renders the "Вимоги:" line, prefixed with ✅/⚠️ when opts.state is given
// (uses engine.js's meetsReq — informational only, doesn't block accept/decline).
function reqHtmlFor(card, opts, wrap) {
  const req = card.req;
  const list = Array.isArray(req) ? req : (req ? [req] : []);
  if (!list.length) return '';
  const prefix = opts.state && typeof meetsReq === 'function'
    ? (meetsReq(opts.state, list) ? '✅ ' : '⚠️ ')
    : '';
  return wrap(prefix + escapeHtml(list.map(reqLabel).join(', ')));
}

// Renders a card using the new layout: TEXT (main) + side image + structured fields.
// opts.hideEffect = true  → hide card.effect (training front side before vote reveal)
window.renderCardHTML = function(card, cardType, opts) {
  opts = opts || {};
  const TYPE_ICONS = {
    emp: '💼', self: '🧑‍💻', random: '💰', deal: '🤝',
    startup: '🚀', course: '📖', training: '🧠', expense: '💸',
    uvolen: '🔥', lyubov: '💍', rebenok: '👶', poluchka: '🏁',
  };
  const TYPE_LABELS = {
    emp: 'Робота на дядю', self: 'Робота на себе',
    random: 'Випадковий заробіток', deal: 'Купи-Продай',
    startup: 'Стартап / Кейс', course: 'Курс',
    training: 'Тренінг', expense: 'Витрати',
    uvolen: 'Звільнено', lyubov: 'Любов',
    rebenok: 'Дитина', poluchka: 'День зарплати',
  };
  const icon  = TYPE_ICONS[cardType]  || '';
  const label = TYPE_LABELS[cardType] || cardType;

  // card.text is primary; fall back to card.effect when not hidden
  const mainText = card.text || (opts.hideEffect ? '' : (card.effect || ''));

  const hasPay   = card.pay > 0;
  const hasBonus = isFlatMoneyBonus(card.bonus);
  const hasImage = card.image && card.image.length > 0;

  // Structured fields
  const reqHtml   = reqHtmlFor(card, opts, v => `<div class="card-field"><span class="cf-label">Вимоги:</span><span class="cf-value">${v}</span></div>`);
  const payHtml   = hasPay   ? `<div class="card-field"><span class="cf-label">Зарплата:</span><span class="cf-value cf-money">$${card.pay.toLocaleString()}</span></div>` : '';
  const bonusHtml = hasBonus ? `<div class="card-field"><span class="cf-label">Бонус:</span><span class="cf-value cf-money">${escapeHtml(card.bonus)}</span></div>` : '';

  // Extra fields for non-employee card types (stubs and future .txt types)
  const extra = [];
  if (card.amount !== undefined) extra.push(`<div class="card-field"><span class="cf-label">Виплата:</span><span class="cf-value cf-money">+$${card.amount}</span></div>`);
  if (card.cost   !== undefined) extra.push(`<div class="card-field"><span class="cf-label">Вартість:</span><span class="cf-value cf-money">$${card.cost}</span></div>`);
  if (card.invest !== undefined) extra.push(`<div class="card-field"><span class="cf-label">Вкладення:</span><span class="cf-value cf-money">$${card.invest}</span></div>`);
  if (card.pct && card.invest)   extra.push(`<div class="card-field"><span class="cf-label">Пасив. дохід:</span><span class="cf-value cf-money">$${Math.round(card.invest * card.pct)}/міс</span></div>`);
  if (card.mult && card.invest)  extra.push(`<div class="card-field"><span class="cf-label">Прибуток:</span><span class="cf-value cf-money">+$${Math.round(card.invest * card.mult)}</span></div>`);
  if (card.term !== undefined)   extra.push(`<div class="card-field"><span class="cf-label">Термін:</span><span class="cf-value">${card.term} міс.</span></div>`);
  if (card.field !== undefined)  extra.push(`<div class="card-field"><span class="cf-label">Сфера:</span><span class="cf-value">${escapeHtml(card.field)}</span></div>`);
  if (cardType === 'self' && card.industry)       extra.push(`<div class="card-field"><span class="cf-label">Сфера:</span><span class="cf-value">${escapeHtml(card.industry)}</span></div>`);
  if (cardType === 'self' && card.additionalCost) extra.push(`<div class="card-field"><span class="cf-label">Докупити:</span><span class="cf-value cf-money">${escapeHtml(card.additionalCost)}</span></div>`);

  const effectHtml = opts.hideEffect
    ? `<div class="card-field"><span class="cf-label">Ефект:</span><span class="cf-value" style="color:#888;font-style:italic">🔒 Невідомий...</span></div>`
    : '';

  const allFields = reqHtml + payHtml + bonusHtml + extra.join('') + effectHtml;
  const fieldsHtml = allFields
    ? `<div class="card-fields">${allFields}</div>`
    : '';

  const textHtml  = mainText ? `<div class="card-fulltext">${escapeHtml(mainText)}</div>` : '';
  const imageHtml = hasImage
    ? `<div class="card-image-col"><img src="assets/cards_images/${card.image}" alt="" onerror="this.parentElement.style.display='none'"></div>`
    : '';

  return `<div class="card-render">
    <div class="card-header">${icon} ${label}</div>
    <div class="card-content-row">
      <div class="card-text-col">${textHtml}${fieldsHtml}</div>
      ${imageHtml}
    </div>
  </div>`;
};

// Renders a physical-card-style HTML block.
// opts.hideEffect = true  → show "effect unknown" placeholder (training front side)
window.renderPhysicalCardHTML = function(card, cardType, opts) {
  opts = opts || {};
  const TYPE_LABELS = {
    emp: '💼 Робота на дядю', self: '🧑‍💻 Робота на себе',
    random: '💰 Випадковий заробіток', deal: '🤝 Купи-Продай',
    startup: '🚀 Стартап / Кейс', course: '📖 Курс',
    training: '🧠 Тренінг', expense: '💸 Витрати',
    uvolen: '🔥 Звільнено', lyubov: '💍 Любов',
    rebenok: '👶 Дитина', poluchka: '🏁 День зарплати',
  };
  const label = TYPE_LABELS[cardType] || cardType;
  const r = (k, v) =>
    `<div class="pcard-row"><span class="pcard-key">${k}</span><span class="pcard-val">${v}</span></div>`;

  let rows = '';
  if (card.pay    !== undefined) rows += r('Дохід:', `$${card.pay}/міс`);
  if (isFlatMoneyBonus(card.bonus)) rows += r('Бонус:', card.bonus);
  if (card.amount !== undefined) rows += r('Виплата:', `+$${card.amount}`);
  if (card.cost   !== undefined) rows += r('Вартість:', `$${card.cost}`);
  if (card.invest !== undefined) rows += r('Вкладення:', `$${card.invest}`);
  if (card.pct && card.invest)   rows += r('Пасив. дохід:', `$${Math.round(card.invest * card.pct)}/міс`);
  if (card.mult && card.invest)  rows += r('Прибуток:', `+$${Math.round(card.invest * card.mult)}`);
  if (card.term   !== undefined) rows += r('Термін:', `${card.term} міс.`);
  if (card.field  !== undefined) rows += r('Сфера:', card.field);
  if (cardType === 'self' && card.industry)       rows += r('Сфера:', card.industry);
  if (cardType === 'self' && card.additionalCost) rows += r('Докупити:', card.additionalCost);

  const reqHtml = reqHtmlFor(card, opts, v => `<div class="pcard-req">Вимоги: ${v}</div>`);

  let effectHtml = '';
  if (opts.hideEffect) {
    effectHtml = `<div class="pcard-hidden">🔒 Ефект невідомий...<br><small>Дізнаєшся після голосування</small></div>`;
  } else if (card.effect) {
    effectHtml = `<div class="pcard-effect">✨ ${card.effect}</div>`;
  }
  const textHtml = card.text ? `<div class="pcard-text">${card.text}</div>` : '';

  const imageHtml = card.image
    ? `<div class="card-image-wrap"><img src="assets/cards_images/${card.image}" alt="${card.name || ''}" onerror="this.style.display='none'"></div>`
    : '';

  const body = rows + reqHtml + effectHtml + textHtml;
  return `<div class="pcard">
    <div class="pcard-header">${label}</div>
    ${imageHtml}
    <div class="pcard-name">${card.name || '—'}</div>
    ${body ? `<div class="pcard-body">${body}</div>` : ''}
  </div>`;
};
