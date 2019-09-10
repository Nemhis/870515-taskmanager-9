import Board from './components/board.js';
import Task from './components/task.js';
import TaskEdit from './components/task-edit.js';
import TaskList from './components/task-list.js';
import LoadButton from './components/load-button';
import Sort from './components/sort';

import {isEscBtn, Position, render} from './utils';

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new TaskList();
  }

  init() {
    // TASK BOARD
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    // SORT
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    // TASK LIST
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    // TASK
    this._tasks.forEach((taskMock) => this._renderTask(taskMock));
    // LOAD MORE BUTTON
    render(this._board.getElement(), (new LoadButton()).getElement(), Position.BEFOREEND);

    document
      .querySelector('.load-more')
      .addEventListener('click', (event) => this._onLoadMoreClick(event));

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderTask(taskMock) {
    const task = new Task(taskMock);
    const taskEdit = new TaskEdit(taskMock);
    const taskListElement = this._taskList.getElement();

    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        taskListElement.replaceChild(task.getElement(), taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const saveFormHandler = () => {
      taskListElement.replaceChild(task.getElement(), taskEdit.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        taskListElement.replaceChild(taskEdit.getElement(), task.getElement());
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
      .addEventListener(`click`, saveFormHandler);

    taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, saveFormHandler);

    render(taskListElement, task.getElement(), Position.BEFOREEND);
  };

  _onLoadMoreClick(event) {
    event.target.style.display = `none`;
    // TODO: нужен метод для загрузки и обработки задач
    // taskMocks.slice(8).forEach((taskMock) => this._renderTask(taskMock));
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    // TODO: для удаления всего html в контейнере использовать 'innerHTML' ?
    this._taskList.getElement().innerHTML = ``;

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        sortedByDateUpTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        sortedByDateDownTasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
      case `default`:
        this._tasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
    }
  }
}
