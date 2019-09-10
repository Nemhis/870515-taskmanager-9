import AbstractComponent from './abstract-component.js';

export default class Board extends AbstractComponent {
  getTemplate() {
    return `<section id="board" class="board container"></section>`;
  }
}
