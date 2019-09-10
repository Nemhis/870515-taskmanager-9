import {createElement} from '../utils.js';
import AbstractComponent from "./abstract-component";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
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
