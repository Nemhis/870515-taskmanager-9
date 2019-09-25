import moment from "moment";

import TaskListController from './task-list-controller';
import SearchResult from '../components/search-result';
import SearchResultInfo from '../components/search-result-info';

import SearchResultGroup from '../components/search-result-group';
import {render, unrender, Position, hideVisually, showVisually} from '../utils';

const MIN_QUERY_LENGTH = 3;

export default class SearchController {
  constructor(container, search, onBackButtonClick, onMainDataChange) {
    this._container = container;
    this._search = search;
    this._onBackButtonClick = onBackButtonClick;
    this._onMainDataChange = onMainDataChange;

    this._tasks = [];

    this._searchResult = new SearchResult();
    this._searchResultInfo = new SearchResultInfo({});
    this._searchResultGroup = new SearchResultGroup({});
    this._taskListController = new TaskListController(
      this._searchResultGroup.getElement().querySelector(`.result__cards`),
      this._onDataChange.bind(this),
    );

    this._init();
  }

  _init() {
    this.hide();

    render(this._container, this._searchResult.getElement(), Position.BEFOREEND);
    render(this._searchResult.getElement(), this._searchResultGroup.getElement(), Position.BEFOREEND);
    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._searchResult.getElement().querySelector(`.result__back`)
      .addEventListener(`click`, () => {
        this._search.getElement().querySelector(`input`).value = ``;
        this._onBackButtonClick();
      });

    this._search.getElement().querySelector(`input`)
      .addEventListener(`keyup`, (evt) => {
        const {value} = evt.target;

        let tasks = this._tasks;

        if (value.length >= MIN_QUERY_LENGTH) {
          tasks = this._tasks.filter((task) => this._hasMatches(task, value));
        }

        this._showSearchResult(value, tasks);
      });
  }

  hide() {
    hideVisually(this._searchResult.getElement());
  }

  show(tasks) {
    this._tasks = tasks;

    if (this._searchResult.getElement().classList.contains(`visually-hidden`)) {
      this._showSearchResult(``, this._tasks);
      showVisually(this._searchResult.getElement());
    }
  }

  _hasMatches(task, value) {
    if (task.description.includes(value)) {
      return true;
    }

    if (value === `D${moment(task.dueDate).format(`DD.MM.YYYY`)}`) {
      return true;
    }

    if (value[0] === `#` && task.tags.has(value.slice(1))) {
      return true;
    }

    return false;
  }

  _showSearchResult(text, tasks) {
    if (this._searchResultInfo) {
      unrender(this._searchResultInfo.getElement());
      this._searchResultInfo.removeElement();
    }

    this._searchResultInfo = new SearchResultInfo({title: text, count: tasks.length});
    const emptyMessage = this._searchResultGroup.getElement().querySelector(`.result__empty`);

    if (tasks.length === 0) {
      showVisually(emptyMessage);
    } else {
      hideVisually(emptyMessage);
    }

    render(this._searchResultGroup.getElement(), this._searchResultInfo.getElement(), Position.AFTERBEGIN);

    this._taskListController.setTasks(tasks);
  }

  _onDataChange(tasks) {
    this._tasks = tasks;
    this._onMainDataChange(this._tasks);
  }
}
