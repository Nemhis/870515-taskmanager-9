import Board from './components/board.js';
import TaskList from './components/task-list.js';

import {Position, render, unrender} from './utils';
import TaskController from './task-controller';
import Sort from './components/sort';

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._subscriptions = [];
  }

  init() {
    // TASK BOARD
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    // SORT
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    // TASK LIST
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    // TASK
    this._tasks.slice(0, 8).forEach((taskMock) => this._renderTask(taskMock));
    // TODO: пока нет механизма рендера только одной карточки вместо всей
    //  доски, то лучше пока не рендерить кнопки загрузки доп. карточек

    // LOAD MORE BUTTON
    // render(this._board.getElement(), (new LoadButton()).getElement(), Position.BEFOREEND);

    // document.querySelector('.load-more').addEventListener('click', (event) => this._onLoadMoreClick(event));

    this._sort.getElement()
      .addEventListener(`click`, (evt) => this._onSortLinkClick(evt))
  }

  _renderBoard() {
    unrender(this._taskList.getElement());

    this._taskList.removeElement();
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._tasks.slice(0, 8).forEach((taskMock) => this._renderTask(taskMock));
  }

  _renderTask(task) {
    const taskController = new TaskController(
      this._taskList.getElement(),
      task,
      this._onDataChange.bind(this),
      this._onChangeView.bind(this)
    );

    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, id) {
    const index = this._tasks.findIndex((it) => it.id === id);
    this._tasks[index] = newData;
    this._renderBoard();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onLoadMoreClick(event) {
    event.target.style.display = `none`;
    this._tasks.slice(8).forEach((taskMock) => this._renderTask(taskMock));
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        this._tasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        break;
      case `date-down`:
        this._tasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        break;
      case `default`:
        this._tasks.forEach((taskMock) => this._renderTask(taskMock));
        break;
    }

    this._renderBoard();
  }
}
