export const getFilterTemplate = (filters) =>
  `<section class="main__filter filter container">
        ${filters.map((filter) =>
    `<input
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
