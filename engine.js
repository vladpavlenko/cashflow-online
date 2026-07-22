// CashFlow Online — engine.js
// Pure calculation functions. No DOM, no global S.

function fieldMatches(a, b) {
  return !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
}

// Courses with effectType 'bonus' + effectUnit 'dollar' add a flat amount to
// matching income; 'unlock'-type courses contribute no money (they only gate meetsReq).
function addPay(state, inc) {
  if (!inc.field) return 0;
  return (state.courses || []).filter(c =>
    c.effectType === 'bonus' && c.effectUnit === 'dollar' && fieldMatches(c.field, inc.field)
  ).reduce((s, c) => s + (parseFloat(c.effectValue) || 0), 0);
}

// Trainings with a 'category' array contribute their 'multiplier' percent to
// any income whose inc.type is listed in that category. Courses with
// effectType 'bonus' + effectUnit 'percent' add their percent the same way,
// gated on the course's field matching the income's field.
function mult(state, inc) {
  const trainingPct = (state.trainings || []).reduce((sum, t) => {
    const cats = t.category || [];
    return sum + (cats.includes(inc.type) ? (parseFloat(t.multiplier) || 0) : 0);
  }, 0);
  const coursePct = (state.courses || []).reduce((sum, c) => {
    if (c.effectType === 'bonus' && c.effectUnit === 'percent' && fieldMatches(c.field, inc.field)) {
      return sum + (parseFloat(c.effectValue) || 0);
    }
    return sum;
  }, 0);
  return 1 + (trainingPct + coursePct) / 100;
}

// Parses free-text req strings from cards_data.js ("course: id", "education: id",
// "license: id", "training: id", "experience: text", "personal: has_children"/
// "has_partner") plus {allOf:[...]}/{anyOf:[...]} grouping, {countTrainings:{category,min}}
// (owns at least `min` trainings whose category array includes `category`), and
// top-level arrays (implicit AND). See player_progression_schema_v2.md for the id enumerations.
function meetsReq(state, req) {
  if (req == null) return true;
  if (Array.isArray(req)) return req.every(r => meetsReq(state, r));
  if (typeof req === 'object') {
    if (req.allOf) return req.allOf.every(r => meetsReq(state, r));
    if (req.anyOf) return req.anyOf.some(r => meetsReq(state, r));
    if (req.countTrainings) {
      const { category, min } = req.countTrainings;
      const owned = (state.trainings || []).filter(t => (t.category || []).includes(category)).length;
      return owned >= (min || 0);
    }
    return true;
  }
  const i = req.indexOf(':');
  const kind  = (i === -1 ? req : req.slice(0, i)).trim().toLowerCase();
  const value = (i === -1 ? '' : req.slice(i + 1)).trim();
  switch (kind) {
    case 'course':    return (state.courses    || []).some(c => c.id === value);
    case 'training':  return (state.trainings  || []).some(t => t.id === value);
    case 'education':  return (state.education  || []).includes(value);
    case 'license':   return (state.licenses   || []).includes(value);
    case 'experience': return (state.experience || []).some(e => e.toLowerCase() === value.toLowerCase());
    case 'personal':
      if (value === 'has_children') return (state.kidsCount || 0) > 0;
      if (value === 'has_partner')  return !!state.hasPartner;
      return false;
    default: return false;
  }
}

function fi(state, inc) {
  const base = parseFloat(inc.basePay) || 0;
  return (base * mult(state, inc)) + addPay(state, inc);
}

function depositIncome(state) {
  return Math.floor((state.deposit || 0) * 0.01);
}

function totalInc(state) {
  return (state.incomes || []).reduce((s, i) => s + fi(state, i), 0) + depositIncome(state);
}

function totalPassiveInc(state) {
  return (state.incomes || []).filter(i => i.type === 'passive').reduce((s, i) => s + fi(state, i), 0);
}

const DEFAULT_EXP = { housingBase: 200, food: 120, comm: 10, transport: 30, kids: 0, hasWife: false, kidCost: 0 };

function hExp(state) {
  const ex = state.exp || DEFAULT_EXP;
  return parseFloat(ex.housingBase) || DEFAULT_EXP.housingBase;
}

function expBreakdown(state) {
  const ex    = state.exp ? { ...DEFAULT_EXP, ...state.exp } : DEFAULT_EXP;
  const loans = state.loans || {};
  const base = (parseFloat(ex.housingBase) || DEFAULT_EXP.housingBase)
    + (parseFloat(ex.food)      || DEFAULT_EXP.food)
    + (parseFloat(ex.comm)      || DEFAULT_EXP.comm)
    + (parseFloat(ex.transport) || DEFAULT_EXP.transport)
    + (ex.hasWife ? (parseFloat(ex.wifeAmt) || 0) : 0)
    + (ex.kids || 0) * (parseFloat(ex.kidCost) || 0);
  const bankDue  = Math.round((parseFloat(loans.bankRem)  || 0) * 0.03);
  const microDue = Math.round((parseFloat(loans.microRem) || 0) * 0.30);
  return { base, bankDue, microDue, total: base + bankDue + microDue };
}

function totalExp(state) {
  return expBreakdown(state).total;
}

function bal(state) {
  return totalInc(state) - totalExp(state);
}

function fmt(n) {
  return '$' + Math.abs(n).toFixed(0);
}

function fmtS(n) {
  return (n >= 0 ? '+' : '−') + fmt(n);
}

const UNI_SPECS = [
  { id: 'eco', nameKey: 'specUniEco', name: 'Економічний',  icon: '📊', field: 'Економіка' },
  { id: 'law', nameKey: 'specUniLaw', name: 'Юридичний',    icon: '⚖️', field: 'Право' },
  { id: 'hum', nameKey: 'specUniHum', name: 'Гуманітарний', icon: '📚', field: 'Гуманітарні науки' },
  { id: 'med', nameKey: 'specUniMed', name: 'Медичний',     icon: '🏥', field: 'Медицина' },
];

const COL_SPECS = [
  { id: 'auto',      nameKey: 'specColAuto',      name: 'Автомеханік',    icon: '🚗',  field: 'Автосправа' },
  { id: 'cook',      nameKey: 'specColCook',      name: 'Кухар',          icon: '👨‍🍳', field: 'Кулінарія' },
  { id: 'plumber',   nameKey: 'specColPlumber',   name: 'Сантехнік',      icon: '🔧',  field: 'Сантехніка' },
  { id: 'carpenter', nameKey: 'specColCarpenter', name: 'Столяр/Плотник', icon: '🪚',  field: 'Столярна справа' },
  { id: 'elec',      nameKey: 'specColElec',      name: 'Електрик',       icon: '⚡',  field: 'Електрика' },
  { id: 'nurse',     nameKey: 'specColNurse',     name: 'Медсестра',      icon: '👩‍⚕️', field: 'Медицина' },
  { id: 'tailor',    nameKey: 'specColTailor',    name: 'Швея',           icon: '🧵',  field: 'Швейна справа' },
];

const FIELDS = [
  { id: 'freelance',   label: 'Фріланс',      sub: null },
  { id: 'beauty',      label: 'Краса',         sub: null },
  { id: 'programming', label: 'Програмування', sub: { label: 'Мова',      placeholder: 'Java, JS, Python...' } },
  { id: 'sport',       label: 'Спорт',         sub: null },
  { id: 'medicine',    label: 'Медицина',      sub: null },
  { id: 'auto',        label: 'Автомобіль',    sub: { label: 'Категорія', placeholder: 'B, C, D...' } },
  { id: 'english',     label: 'Англійська',    sub: { label: 'Рівень',    placeholder: 'A1, B2, C1...' } },
  { id: 'custom',      label: 'Довільне...',   sub: { label: 'Назва',     placeholder: '' } },
];

if (typeof module !== 'undefined') module.exports = { fi, addPay, mult, meetsReq, totalInc, totalExp, expBreakdown, bal, fmt, fmtS, depositIncome, totalPassiveInc, hExp, UNI_SPECS, COL_SPECS, FIELDS };
