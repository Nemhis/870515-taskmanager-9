import {createElement} from '../utils.js';

export default class Board {
  constructor() {}

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  getRemoveElement() {
    this._element = null;
  }

  getTemplate() {
    return `<section id="board" class="board container">
        <div class="board__filter-list">
          <a href="#" class="board__filter">SORT BY DEFAULT</a>
          <a href="#" class="board__filter">SORT BY DATE up</a>
          <a href="#" class="board__filter">SORT BY DATE down</a>
        </div>

        <div class="board__tasks">
          <!-- Контент -->
        </div>
      </section>`;
  }
}
