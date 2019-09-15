import Task from "./components/task";
import TaskEdit from "./components/task-edit";
import {isEscBtn, Position, render} from "./utils";

export default class TaskController {
  constructor(container, data, onDataChange, onChangeView) {
    this._container = container;
    this._data = data;

    this._task = new Task(data);
    this._taskEdit = new TaskEdit(data);

    this._onDataChange = onDataChange;
    this._onChangeView = onChangeView;

    this.init();
  }

  init() {
    const onEscKeyDown = (evt) => {
      if (isEscBtn(evt.key)) {
        this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const saveFormHandler = (event) => {
      event.preventDefault();
      this._onDataChange(this._collectFormData(), this._data);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    this._task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        this._container.replaceChild(this._taskEdit.getElement(), this._task.getElement());
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement()
      .querySelector(`.card__save`)
      .addEventListener(`click`, saveFormHandler);

    this._taskEdit.getElement()
      .querySelector(`.card__form`)
      .addEventListener(`submit`, saveFormHandler);

    render(this._container, this._task.getElement(), Position.BEFOREEND);
  };

  _collectFormData() {
    const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));

    return {
      id: Number(formData.get(`id`)),
      description: formData.get(`description`),
      color: formData.get(`color`),
      tags: new Set(formData.getAll(`hashtag`)),
      dueDate: (new Date(formData.get(`date`))).getTime(),
      repeatingDays: formData.getAll(`repeat`).reduce((acc, it) => {
        acc[it] = true;
        return acc;
      }, {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      })
    };
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
    }
  }
}
