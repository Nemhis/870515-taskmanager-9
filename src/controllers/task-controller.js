import Task from "../components/task";
import TaskEdit from "../components/task-edit";
import {isEscBtn, Position, render} from "../utils";

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
        // Сбрасываем данные, потому что пользователь их не сохранил
        this._taskEdit = new TaskEdit(this._data);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const saveFormHandler = () => {
      document.removeEventListener(`keydown`, onEscKeyDown);
      this._onDataChange(this._collectFormData(), this._data.id);
    };

    const onAddToArchive = () => {
      this._data.isArchive = !this._data.isArchive;
      this._onDataChange(this._data, this._data.id);
    };

    const onAddToFavorite = () => {
      this._data.isFavorite = !this._data.isFavorite;
      this._onDataChange(this._data, this._data.id);
    };

    this._task.getElement()
      .querySelector(`.card__btn--edit`)
      .addEventListener(`click`, () => {
        this._onChangeView();
        document.addEventListener(`keydown`, onEscKeyDown);
        this._container.replaceChild(this._taskEdit.getElement(), this._task.getElement());
      });

    this._task.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, onAddToArchive);

    this._task.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, onAddToFavorite);

    this._taskEdit.getElement()
      .querySelector(`.card__btn--archive`)
      .addEventListener(`click`, onAddToArchive);

    this._taskEdit.getElement()
      .querySelector(`.card__btn--favorites`)
      .addEventListener(`click`, onAddToFavorite);

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`focus`, () => {
        document.removeEventListener(`keydown`, onEscKeyDown);
      });

    this._taskEdit.getElement().querySelector(`textarea`)
      .addEventListener(`blur`, () => {
        document.addEventListener(`keydown`, onEscKeyDown);
      });

    const submitButton = this._taskEdit.getElement().querySelector(`.card__save`);
    const form = this._taskEdit.getElement().querySelector(`.card__form`);
    form.addEventListener(`submit`, (evt) => evt.preventDefault());
    submitButton.addEventListener(`click`, saveFormHandler);
    form.addEventListener(`submit`, saveFormHandler);

    form
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`focus`, () => {
        form.removeEventListener(`submit`, saveFormHandler);
        submitButton.removeEventListener(`click`, saveFormHandler);
      });

    form
      .querySelector(`.card__hashtag-input`)
      .addEventListener(`blur`, () => {
        form.addEventListener(`submit`, saveFormHandler);
        submitButton.addEventListener(`click`, saveFormHandler);
      });

    this._taskEdit.getElement().querySelector(`.card__delete`)
      .addEventListener(`click`, () => {
        this._onDataChange(null, this._data.id);
      });

    render(this._container, this._task.getElement(), Position.BEFOREEND);
  }

  _collectFormData() {
    const formData = new FormData(this._taskEdit.getElement().querySelector(`.card__form`));
    const newData = {
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

    return Object.assign(this._data, newData);
  }

  setDefaultView() {
    if (this._container.contains(this._taskEdit.getElement())) {
      this._container.replaceChild(this._task.getElement(), this._taskEdit.getElement());
    }
  }
}
