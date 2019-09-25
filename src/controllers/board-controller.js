import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import LoadButton from "../components/load-button";
import Sort from '../components/sort';
import TaskListController from "./task-list-controller";

import {hideVisually, Position, render, showVisually, unrender} from '../utils';

const ITEMS_ON_BORD = 8;

export default class BoardController {
  constructor(container, onMainDataChange) {
    this._container = container;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new TaskList();
    this._onMainDataChange = onMainDataChange;

    this._loadMoreButton = new LoadButton();
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));
    this._init();
  }

  _init() {
    // TASK BOARD
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    // SORT
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    // TASK LIST
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _renderBoard() {
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);

    unrender(this._loadMoreButton.getElement());
    this._loadMoreButton.removeElement();

    if (this._currentTasksCount < this._tasks.length) {
      render(this._board.getElement(), this._loadMoreButton.getElement(), Position.BEFOREEND);
    }

    this._taskListController.setTasks(this._tasks.slice(0, this._currentTasksCount));

    this._loadMoreButton.getElement()
      .addEventListener(`click`, () => this._onLoadMoreClick());
  }

  _onSortLinkClick(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== `A`) {
      return;
    }

    switch (evt.target.dataset.sortType) {
      case `date-up`:
        const sortedByDateUpTasks = this._tasks.slice().sort((a, b) => a.dueDate - b.dueDate);
        this._taskListController.setTasks(sortedByDateUpTasks);
        break;
      case `date-down`:
        const sortedByDateDownTasks = this._tasks.slice().sort((a, b) => b.dueDate - a.dueDate);
        this._taskListController.setTasks(sortedByDateDownTasks);
        break;
      case `default`:
        this._taskListController.setTasks(this._tasks);
        break;
    }
  }

  _onDataChange(tasks) {
    this._tasks = [...tasks, ...this._tasks.slice(this._currentTasksCount)];
    this._renderBoard();
    this._onMainDataChange(this._tasks);
  }

  _setTasks(tasks) {
    this._tasks = tasks;
    this._currentTasksCount = ITEMS_ON_BORD;

    this._renderBoard();
  }

  show(tasks) {
    if (tasks !== this._tasks) {
      this._setTasks(tasks);
    }

    showVisually(this._board.getElement());
  }

  hide() {
    hideVisually(this._board.getElement());
  }

  createTask() {
    this._taskListController.createTask();
  }

  _onLoadMoreClick() {
    this._taskListController.addTasks(this._tasks.slice(this._currentTasksCount, this._currentTasksCount + ITEMS_ON_BORD));
    this._currentTasksCount += ITEMS_ON_BORD;

    if (this._currentTasksCount >= this._tasks.length) {
      unrender(this._loadMoreButton.getElement());
      this._loadMoreButton.removeElement();
    }
  }
}
