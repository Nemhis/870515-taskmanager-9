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

export const createFilters = (tasks) => {
  return [
    {
      title: `all`,
      count: tasks.length,
    },
    {
      title: `overdue`,
      count: tasks.filter((task) => (Date.now() > task.dueDate)).length,
    },
    {
      title: `today`,
      count: tasks.filter((task) => {
        const today = new Date();
        const dueDate = new Date(task.dueDate);

        return today.toDateString() === dueDate.toDateString();
      }).length,
    },
    {
      title: `favorites`,
      count: tasks.filter((task) => task.isFavorite).length,
    },
    {
      title: `repeating`,
      count: tasks.filter((task) =>
        Object
          .keys(task.repeatingDays)
          .some(day => task.repeatingDays[day])
      ).length,
    },
    {
      title: `tags`,
      count: tasks.filter((task) => task.tags.size).length,
    },
    {
      title: `archive`,
      count: tasks.filter((task) => task.isArchive).length,
    },
  ];
};


function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
