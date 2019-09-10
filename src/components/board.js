import AbstractComponent from './abstract-component.js';

export default class Board extends AbstractComponent {
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
