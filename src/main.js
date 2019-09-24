import BoardController from './controllers/board-controller';
import SearchController from './controllers/search-controller';

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
const search = new Search();
render(mainContainer, search.getElement(), Position.BEFOREEND);

// FILTER
render(mainContainer, (new Filter(createFilters(taskMocks.slice(0, 8)))).getElement(), Position.BEFOREEND);

const statistic = new Statistic();
hideVisually(statistic.getElement());
const boardController = new BoardController(mainContainer);

const onSearchBackButtonClick = () => {
  hideVisually(statistic.getElement());
  searchController.hide();
  boardController.show(taskMocks);
};

const searchController = new SearchController(mainContainer, search, onSearchBackButtonClick);

boardController.show(taskMocks);
render(mainContainer, statistic.getElement(), Position.BEFOREEND);

search.getElement().addEventListener(`click`, () => {
  hideVisually(statistic.getElement());
  boardController.hide();
  searchController.show(taskMocks);
});

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
    case `control__new-task`:
      menu.getElement().querySelector(`#control__task`).checked = true;
      boardController.createTask();
      break;
  }
});

