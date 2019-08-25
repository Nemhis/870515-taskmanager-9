import {createTask, createFilters} from './data.js';

import {getMenuTemplate} from './components/menu.js';
import {getSearchTemplate} from './components/search.js';
import {getFilterTemplate} from './components/filter.js';
import {getEditTaskFormTemplate} from './components/edit-task.js';
import {getCardTemplate} from './components/card.js';
import {getLoadButtonTemplate} from './components/load-button.js';
import {getBoardTemplate} from './components/board.js';

const CARD_LIST_LENGTH = 16;

function render(container, template) {
  container.insertAdjacentHTML(`beforeend`, template);
}

render(document.querySelector(`.main__control`), getMenuTemplate());

const mainElement = document.querySelector(`.main`);

render(mainElement, getSearchTemplate());

const tasks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

console.log(createFilters(tasks));
render(mainElement, getFilterTemplate(createFilters(tasks)));

render(mainElement, getBoardTemplate());

const taskBoardElement = document.querySelector(`.board__tasks`);

render(taskBoardElement, getEditTaskFormTemplate(tasks.slice(0, 1)[0]));

render(taskBoardElement, tasks.slice(1, 8).map(getCardTemplate).join(``));

render(document.querySelector(`.board`), getLoadButtonTemplate());

document.querySelector('.load-more').addEventListener('click', (event, element) => {
  event.target.style.display = `none`;
  render(taskBoardElement, tasks.slice(8, 16).map(getCardTemplate).join(``));
});
