import AbstractComponent from './abstract-component.js';

export default class SearchResultGroup extends AbstractComponent {
  getTemplate() {
    return `<section class="result__group">
      <div class="result__cards"></div>
      <p class="result__empty">no matches found...</p>
    </section>`;
  }
}
