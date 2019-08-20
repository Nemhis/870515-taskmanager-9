import {createTask, createFilters} from './data.js';

import {getMenuTemplate} from './components/menu.js';
import {getSearchTemplate} from './components/search.js';
import {getFilterTemplate} from './components/filter.js';
import {getEditTaskFormTemplate} from './components/edit-task.js';
import {getCardTemplate} from './components/card.js';
import {getLoadButtonTemplate} from './components/load-button.js';
import {getBoardTemplate} from './components/board.js';

const CARD_LIST_LENGTH = 3;

function render(container, template) {
  container.insertAdjacentHTML(`beforeend`, template);
}

render(document.querySelector(`.main__control`), getMenuTemplate());

const mainElement = document.querySelector(`.main`);

render(mainElement, getSearchTemplate());

const tasks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

render(mainElement, getFilterTemplate(createFilters(tasks)));

render(mainElement, getBoardTemplate());

const taskBoardElement = document.querySelector(`.board__tasks`);

render(taskBoardElement, getEditTaskFormTemplate());

render(taskBoardElement, tasks.map(getCardTemplate).join(``));

render(document.querySelector(`.board`), getLoadButtonTemplate());
