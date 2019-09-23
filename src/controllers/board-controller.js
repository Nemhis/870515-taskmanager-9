import Board from '../components/board.js';
import TaskList from '../components/task-list.js';
import LoadButton from "../components/load-button";
import Sort from '../components/sort';
import TaskListController from "./task-list-controller";

import {hideVisually, Position, render, showVisually, unrender} from '../utils';

const ITEMS_ON_BORD = 8;

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._sort = new Sort();
    this._taskList = new TaskList();

    this._loadMoreButton = null;
    this._taskListController = new TaskListController(this._taskList.getElement(), this._onDataChange.bind(this));
    this._currentTasksCount = ITEMS_ON_BORD;
  }

  init() {
    // TASK BOARD
    render(this._container, this._board.getElement(), Position.BEFOREEND);
    // SORT
    render(this._board.getElement(), this._sort.getElement(), Position.BEFOREEND);
    // TASK LIST
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    // TASK
    this._renderBoard();
    this._updateLoadMoreButton();

    this._sort.getElement().addEventListener(`click`, (evt) => this._onSortLinkClick(evt));
  }

  _unrenderBord() {
    unrender(this._taskList.getElement());
    this._taskList.removeElement();
  }

  _renderBoard() {
    this._taskListController.setTasks(this._tasks.slice(0, this._currentTasksCount));
  }

  _reRenderBoard() {
    this._unrenderBord();
    render(this._board.getElement(), this._taskList.getElement(), Position.BEFOREEND);
    this._renderBoard();
    this._updateLoadMoreButton();
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

    this._reRenderBoard();
  }

  _onDataChange(tasks) {
    this._tasks = [...tasks, ...this._tasks];
    this._renderBoard();
  }

  show() {
    showVisually(this._board.getElement());
  }

  hide() {
    hideVisually(this._board.getElement());
  }

  /**
   * Вычисляем необходимость отрисовки кнопки загрузки
   *
   * @private
   */
  _updateLoadMoreButton() {
    if (this._currentTasksCount === this._tasks.length) {
      if (this._loadMoreButton) {
        this._unrenderLoadMoreButton();
      }
    } else {
      this._renderLoadMoreButton();
    }
  }

  _renderLoadMoreButton() {
    this._loadMoreButton = new LoadButton();
    render(this._board.getElement(), this._loadMoreButton.getElement(), Position.BEFOREEND);
    document.querySelector('.load-more').addEventListener('click', (event) => this._onLoadMoreClick(event));
  }

  _unrenderLoadMoreButton() {
    unrender(this._loadMoreButton.getElement());
    this._loadMoreButton.removeElement();
  }

  _onLoadMoreClick() {
    this._currentTasksCount += ITEMS_ON_BORD;
    this._reRenderBoard();
  }
}
