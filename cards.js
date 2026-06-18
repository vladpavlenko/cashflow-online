// Структура карток — буде заповнюватись пізніше з фото

const CARDS = {
  jobs_employee: [
    // { id, name, pay, requirements: [], field: '' }
  ],
  jobs_self: [
    // { id, name, pay, requirements: [], field: '' }
  ],
  startups: [
    // { id, name, invest, monthlyPay, requirements: [] }
  ],
  deals: [
    // { id, name, invest, profit, term, requirements: [] }
  ],
  courses: [
    // { id, name, field, subField, pay, cost }
  ],
  trainings: [
    // { id, name, bonusPct, applyTo: [] }
  ],
  expenses: [
    // { id, amount, condition: null }
  ],
  random_income: [
    // { id, name, amount, requirements: [] }
  ],
};

function drawCard(type) {
  const deck = CARDS[type];
  if (!deck || deck.length === 0) return null;
  return deck[Math.floor(Math.random() * deck.length)];
}
