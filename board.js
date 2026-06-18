// Клітини ігрового поля — 24 клітини
const BOARD_CELLS = [
  { id: 0,  type: 'dela',    label: 'Дела' },
  { id: 1,  type: 'trening', label: 'Тренинг' },
  { id: 2,  type: 'dela',    label: 'Дела' },
  { id: 3,  type: 'rashody', label: 'Расходы' },
  { id: 4,  type: 'dela',    label: 'Дела' },
  { id: 5,  type: 'trening', label: 'Тренинг' },
  { id: 6,  type: 'dela',    label: 'Дела' },
  { id: 7,  type: 'uvolen',  label: 'Уволен' },
  { id: 8,  type: 'dela',    label: 'Дела' },
  { id: 9,  type: 'trening', label: 'Тренинг' },
  { id: 10, type: 'rashody', label: 'Расходы' },
  { id: 11, type: 'dela',    label: 'Дела' },
  { id: 12, type: 'lyubov',  label: 'Любовь' },
  { id: 13, type: 'trening', label: 'Тренинг' },
  { id: 14, type: 'dela',    label: 'Дела' },
  { id: 15, type: 'rashody', label: 'Расходы' },
  { id: 16, type: 'dela',    label: 'Дела' },
  { id: 17, type: 'trening', label: 'Тренинг' },
  { id: 18, type: 'rebenok', label: 'Ребенок' },
  { id: 19, type: 'dela',    label: 'Дела' },
  { id: 20, type: 'trening', label: 'Тренинг' },
  { id: 21, type: 'rashody', label: 'Расходы' },
  { id: 22, type: 'dela',    label: 'Дела' },
  { id: 23, type: 'dohody',  label: 'Доходы' },
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
