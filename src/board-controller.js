import Board from "./components/board.js";
import TaskList from "./components/task-list.js";

import {Position, render, unrender} from "./utils";
import Menu from "./components/menu";
import Search from "./components/search";
import Filter from "./components/filter";
import LoadButton from "./components/load-button";
import TaskController from "./task-controller";

import {createFilters} from "./data";

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
    this._subscriptions = [];
  }

  init() {
    // MENU
    render(document.querySelector(`.main__control`), (new Menu()).getElement(), Position.BEFOREEND);
    // SEARCH
    render(this._container, (new Search()).getElement(), Position.BEFOREEND);
    // FILTER
    render(this._container, (new Filter(createFilters(this._tasks))).getElement(), Position.BEFOREEND);
    // TASK BOARD
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    // TASK LIST
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    // TASK
    this._tasks.slice(0, 8).forEach((taskMock) => this._renderTask(taskMock));
    // TODO: пока нет механизма рендера только одной карточки вместо всей
    //  доски, то лучше пока не рендерить кнопки загрузки доп. карточек

    // LOAD MORE BUTTON
    // render(this._board.getElement(), (new LoadButton()).getElement(), Position.BEFOREEND);

    // document.querySelector('.load-more').addEventListener('click', (event) => this._onLoadMoreClick(event));
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

  _onDataChange(newData, oldData) {
    this._tasks[this._tasks.findIndex((it) => it.id === oldData.id)] = newData;
    this._renderBoard();
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  _onLoadMoreClick(event) {
    event.target.style.display = `none`;
    this._tasks.slice(8).forEach((taskMock) => this._renderTask(taskMock));
  }
}
