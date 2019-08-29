import {createTask, createFilters} from './data.js';
import {Position, render} from './utils.js';

import Menu from './components/menu.js';
import Search from './components/search.js';
import Filter from './components/filter.js';
import Board from './components/board.js';
import TaskEdit from './components/task-edit.js';
import Task from './components/task.js';
import LoadButton from './components/load-button.js';

const CARD_LIST_LENGTH = 16;

render(document.querySelector(`.main__control`), (new Menu()).getElement(), Position.BEFOREEND);


const mainElement = document.querySelector(`.main`);

render(mainElement, (new Search()).getElement(), Position.BEFOREEND);


const taskMocks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

render(mainElement, (new Filter(createFilters(taskMocks))).getElement(), Position.BEFOREEND);

render(mainElement, (new Board()).getElement(), Position.BEFOREEND);

const taskBoardElement = document.querySelector(`.board__tasks`);

render(document.querySelector(`.board`), (new LoadButton()).getElement(), Position.BEFOREEND);

const renderTask = (taskMock) => {
  const task = new Task(taskMock);
  const taskEdit = new TaskEdit(taskMock);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      taskBoardElement.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  task.getElement()
    .querySelector(`.card__btn--edit`)
    .addEventListener(`click`, () => {
      taskBoardElement.replaceChild(taskEdit.getElement(), task.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`focus`, () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement().querySelector(`textarea`)
    .addEventListener(`blur`, () => {
      document.addEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__save`)
    .addEventListener(`click`, () => {
      taskBoardElement.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  taskEdit.getElement()
    .querySelector(`.card__form`)
    .addEventListener(`submit`, () => {
      taskBoardElement.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

  render(taskBoardElement, task.getElement(), Position.BEFOREEND);
};

taskMocks.slice(0, 8).forEach((taskMock) => renderTask(taskMock));

document.querySelector('.load-more').addEventListener('click', (event, element) => {
  event.target.style.display = `none`;
  taskMocks.slice(8).forEach((taskMock) => renderTask(taskMock));
});
