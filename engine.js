// CashFlow Online — engine.js
// Pure calculation functions. No DOM, no global S.

function addPay(state, inc) {
  if (!inc.field) return 0;
  return (state.courses || []).filter(c => {
    if (c.field.trim().toLowerCase() !== inc.field.trim().toLowerCase()) return false;
    const cSub = (c.subField || '').trim().toLowerCase();
    const iSub = (inc.subField || '').trim().toLowerCase();
    if (cSub && iSub && cSub === iSub) return false;
    return true;
  }).reduce((s, c) => s + (parseFloat(c.pay) || 0), 0);
}

function mult(state, inc) {
  const bonusSum = (state.trainings || []).reduce((sum, t) => {
    let pct = 0;
    if (inc.type === 'employee') {
      const field = (inc.field || '').toLowerCase().trim();
      const isConsultant = field === 'консультант' || field === 'consultant';
      pct = isConsultant ? (parseFloat(t.mEmpConsultant) || 0) : (parseFloat(t.mEmpGeneral) || 0);
    } else if (inc.type === 'self') {
      pct = parseFloat(t.mSelf) || 0;
    } else if (inc.type === 'passive') {
      pct = parseFloat(t.mBiz) || 0;
    }
    return sum + pct;
  }, 0);
  return 1 + bonusSum / 100;
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

function hExp(state) {
  return parseFloat(state.exp.housingBase) || 0;
}

function totalExp(state) {
  const ex = state.exp;
  const loans = state.loans;
  return hExp(state)
    + (parseFloat(ex.food) || 0)
    + (parseFloat(ex.comm) || 0)
    + (parseFloat(ex.transport) || 0)
    + (ex.hasWife ? (parseFloat(ex.wifeAmt) || 0) : 0)
    + ex.kids * (parseFloat(ex.kidCost) || 0)
    + Math.round((parseFloat(loans.bankRem) || 0) * 0.03)
    + Math.round((parseFloat(loans.microRem) || 0) * 0.30);
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

if (typeof module !== 'undefined') module.exports = { fi, addPay, mult, totalInc, totalExp, bal, fmt, fmtS, depositIncome, totalPassiveInc, hExp, UNI_SPECS, COL_SPECS, FIELDS };
