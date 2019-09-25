import AbstractComponent from './abstract-component';

export default class Filter extends AbstractComponent {
  constructor(filters, activeFilter = `all`) {
    super();
    this._filters = filters;
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return `<section class="main__filter filter container">
        ${this._filters.map((filter) => `<input
          type="radio"
          id="filter__${filter.title}"
          data-filter-name="${filter.title}"
          class="filter__input visually-hidden"
          name="filter"
          ${filter.count === 0 ? `disabled` : ``}
          ${filter.title === this._activeFilter ? `checked` : ``}
        />
        <label for="filter__${filter.title}" class="filter__label">
          ${filter.title} <span class="filter__${filter.title}-count">${filter.count}</span></label
        >
        `).join(``)}
      </section>`;
  }
}
