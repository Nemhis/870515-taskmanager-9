import Board from "./components/board.js";
import Task from "./components/task.js";
import TaskEdit from "./components/task-edit.js";
import TaskList from "./components/task-list.js";

import {isEscBtn, Position, render} from "./utils";
import Menu from "./components/menu";
import Search from "./components/search";
import Filter from "./components/filter";
import LoadButton from "./components/load-button";

import {createFilters} from "./data";

export default class BoardController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._board = new Board();
    this._taskList = new TaskList();
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
    // LOAD MORE BUTTON
    render(this._board.getElement(), (new LoadButton()).getElement(), Position.BEFOREEND);

    document.querySelector('.load-more').addEventListener('click', (event) => this._onLoadMoreClick(event));
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
    this._tasks.slice(8).forEach((taskMock) => this._renderTask(taskMock));
  }
}
