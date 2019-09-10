import AbstractComponent from './abstract-component.js';

export default class TaskList extends AbstractComponent {
  getTemplate() {
    return `<div class="board__tasks"></div>`;
  }
}
