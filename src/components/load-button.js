import {createElement} from '../utils.js';

export default class LoadButton {
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
    return `<button class="load-more" type="button">load more</button>`;
  }
}
