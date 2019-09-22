import BoardController from './controllers/board-controller';
import Filter from './components/filter';
import Menu from './components/menu';
import Search from './components/search';
import Statistic from './components/statistic';

import {hideVisually, Position, render, showVisually} from './utils';
import {createTask, createFilters} from './data.js';

const CARD_LIST_LENGTH = 16;
const taskMocks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

const mainContainer = document.querySelector(`.main`);

// MENU
const menu = new Menu();
render(mainContainer.querySelector(`.main__control`), menu.getElement(), Position.BEFOREEND);

// SEARCH
render(mainContainer, (new Search()).getElement(), Position.BEFOREEND);

// FILTER
render(mainContainer, (new Filter(createFilters(taskMocks.slice(0, 8)))).getElement(), Position.BEFOREEND);

const boardController = new BoardController(mainContainer, taskMocks.slice(0, 8));
boardController.init();

const statistic = new Statistic();
hideVisually(statistic.getElement());
render(mainContainer, statistic.getElement(), Position.BEFOREEND);

menu.getElement().addEventListener(`change`, (evt) => {
  evt.preventDefault();

  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  switch (evt.target.id) {
    case `control__task`:
      hideVisually(statistic.getElement());
      boardController.show();
      break;
    case `control__statistic`:
      showVisually(statistic.getElement());
      boardController.hide();
      break;
  }
});
