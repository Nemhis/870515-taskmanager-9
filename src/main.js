import BoardController from "./board-controller";
import {createTask} from './data.js';

const CARD_LIST_LENGTH = 16;
const taskMocks = new Array(CARD_LIST_LENGTH)
  .fill(``)
  .map(createTask);

const boardController = new BoardController(document.querySelector(`.main`), taskMocks);
boardController.init();
