export const colors = [
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`,
];

export const createTask = (value, index) => ({
  id: (index + 1),
  description: [`Изучить теорию`, `Сделать домашку`, `Пройти интенсив на соточку`][Math.floor(Math.random() * 3)],
  dueDate: Date.now() + Math.pow(-1, Math.floor(Math.random() * 3)) + Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000, // +- неделя
  repeatingDays: {
    'mo': false,
    'tu': Boolean(Math.round(Math.random())),
    'we': false,
    'th': Boolean(Math.round(Math.random())),
    'fr': false,
    'sa': Boolean(Math.round(Math.random())),
    'su': false,
  },
  tags: new Set(shuffleArray([
    `homework`,
    `theory`,
    `practice`,
    `intensive`,
    `keks`,
    `relax`,
  ]).slice(0, Math.round(Math.random() * 3))),
  color: colors[Math.floor(Math.random() * 5)],
  isFavorite: Boolean(Math.round(Math.random())),
  isArchive: Boolean(Math.round(Math.random())),
});

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
