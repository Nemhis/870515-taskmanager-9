import BoardController from "./board-controller";
import Filter from "./components/filter";
import Menu from "./components/menu";
import Search from "./components/search";

import {Position, render} from "./utils";
import {createTask, createFilters} from './data.js';

const CARD_LIST_LENGTH = 16;
const taskMocks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

const mainContainer = document.querySelector(`.main`);

// MENU
render(mainContainer.querySelector(`.main__control`), (new Menu()).getElement(), Position.BEFOREEND);

// SEARCH
render(mainContainer, (new Search()).getElement(), Position.BEFOREEND);

// FILTER
render(mainContainer, (new Filter(createFilters(taskMocks.slice(0, 8)))).getElement(), Position.BEFOREEND);

const boardController = new BoardController(mainContainer, taskMocks.slice(0, 8));
boardController.init();
