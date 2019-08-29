import {createElement} from '../utils.js';

export class Filter {
  constructor(filters) {
    this._filters = filters;
  }

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
    return `<section class="main__filter filter container">
        ${this._filters.map((filter) => `<input
          type="radio"
          id="filter__${filter.title}"
          class="filter__input visually-hidden"
          name="filter"
          ${filter.count !== 0 ? `checked` : `disabled`}
        />
        <label for="filter__all" class="filter__label">
          ${filter.title} <span class="filter__${filter.title}-count">${filter.count}</span></label
        >
        `).join(``)}
      </section>`;
  }
}
