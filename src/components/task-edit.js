import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';

import AbstractComponent from "./abstract-component";

import {colors} from "../data.js";
import {isEnterBtn} from "../utils";

export default class TaskEdit extends AbstractComponent {
  constructor({description, dueDate, tags, color, repeatingDays}) {
    super();
    this._description = description;
    this._dueDate = new Date(dueDate);
    this._tags = tags;
    this._color = color;
    this._repeatingDays = repeatingDays;

    this._isRepeat = Object.keys(this._repeatingDays).some((day) => this._repeatingDays[day]);

    this.setListeners();
    this.initDatePicker();
  }

  setListeners() {
    const element = this.getElement();

    // Date
    element
      .querySelector('.card__date-deadline-toggle')
      .addEventListener('click', () => {
        this._dueDate = this._dueDate ? null : new Date();
        const statusEl = element.querySelector('.card__date-status');
        statusEl.firstChild.remove();
        statusEl.append(this._dueDate ? `yes` : `no`);

        if (this._dueDate) {
          element.querySelector('.card__date-deadline').removeAttribute(`disabled`);
        } else {
          element.querySelector('.card__date-deadline').setAttribute(`disabled`, `disabled`);
          element.querySelector('.card__date').setAttribute(`value`, new Date().toDateString());
        }
      });

    // Repeat
    element
      .querySelector(`.card__repeat-toggle`)
      .addEventListener('click', () => {
        this._isRepeat = !this._isRepeat;
        const statusEl = element.querySelector(`.card__repeat-status`);
        statusEl.firstChild.remove();
        statusEl.append(this._isRepeat ? `yes` : `no`);

        const fieldset = element.querySelector(`.card__repeat-days`);

        if (this._isRepeat) {
          fieldset.removeAttribute(`disabled`);
        } else {
          fieldset.setAttribute(`disabled`, `disabled`);
        }

        Array.from(fieldset.querySelectorAll(`.card__repeat-day-input`))
          .forEach((input) => {
            input.removeAttribute('checked');
          });

        Object.keys(this._repeatingDays).forEach((day) => {
          this._repeatingDays[day] = false;
        });
      });

    // Colors
    element.addEventListener(`click`, (event) => {
      const colorLabel = event.target;

      if (!colorLabel.classList.contains(`card__color`)) {
        return;
      }

      element.classList.remove(`card--${this._color}`);
      this._color = element.querySelector(`#${colorLabel.getAttribute(`for`)}`).value;
      element.classList.add(`card--${this._color}`);
    });

    // Tags
    element.addEventListener(`click`, (event) => {
      const clearTagBtn = event.target;

      if (!clearTagBtn.classList.contains(`card__hashtag-delete`)) {
        return;
      }

      const tagInput = clearTagBtn.parentNode.querySelector(`.card__hashtag-hidden-input`);
      this._tags.delete(tagInput.value);
      clearTagBtn.parentNode.remove();
    });

    const hashTagTextInput = element.querySelector(`.card__hashtag-input`);

    const onEnter = (event) => {
      if (!isEnterBtn(event.key)) {
        return;
      }

      let newTag = String(hashTagTextInput.value).trim();

      if (newTag.length) {
        this._tags.add(newTag);
        element.querySelector(`.card__hashtag-list`).insertAdjacentHTML(`beforeend`, this._getTagTemplate(newTag));
        hashTagTextInput.value = ``;
      }
    };

    hashTagTextInput
      .addEventListener(`focus`, () => {
        document.addEventListener(`keydown`, onEnter);
      });

    hashTagTextInput
      .addEventListener(`blur`, () => {
        document.removeEventListener(`keydown`, onEnter);
      });
  }

  initDatePicker() {
    flatpickr(this.getElement().querySelector('.card__date'), {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
    });
  }

  _getTagTemplate(tag) {
    return `<span class="card__hashtag-inner">
                          <input
                            type="hidden"
                            name="hashtag"
                            value="${tag}"
                            class="card__hashtag-hidden-input"
                          />
                          <p class="card__hashtag-name">
                            #${tag}
                          </p>
                          <button type="button" class="card__hashtag-delete">
                            delete
                          </button>
                        </span>`;
  }

  getTemplate() {
    return `<article class="card card--edit card--${this._color} ${this._isRepeat ? `card--repeat` : ``}">
            <form class="card__form" method="get">
              <div class="card__inner">
                <div class="card__control">
                  <button type="button" class="card__btn card__btn--archive">
                    archive
                  </button>
                  <button
                    type="button"
                    class="card__btn card__btn--favorites"
                  >
                    favorites
                  </button>
                </div>
                <div class="card__color-bar">
                  <svg class="card__color-bar-wave" width="100%" height="10">
                    <use xlink:href="#wave"></use>
                  </svg>
                </div>
                <div class="card__textarea-wrap">
                  <label>
                    <textarea
                      class="card__text"
                      placeholder="Start typing your text here..."
                      name="description"
                    >${this._description}</textarea>
                  </label>
                </div>
                <div class="card__settings">
                  <div class="card__details">
                    <div class="card__dates">
                      <button class="card__date-deadline-toggle" type="button">
                        date: <span class="card__date-status">${this._dueDate ? `yes` : `no`}</span>
                      </button>
                      <fieldset class="card__date-deadline" ${this._dueDate ? `` : `disabled`}>
                        <label class="card__input-deadline-wrap">
                          <input
                            class="card__date"
                            type="text"
                            placeholder="23 September"
                            name="date"
                            ${this._dueDate ? `value="` + flatpickr.formatDate(this._dueDate, "Y-m-d") + `"` : ``}
                          />
                        </label>
                      </fieldset>
                      <button class="card__repeat-toggle" type="button">
                        repeat:
                        <span class="card__repeat-status">
                          ${this._isRepeat ? `yes` : `no`}
                        </span>
                      </button>
                      <fieldset class="card__repeat-days" ${this._isRepeat ? `` : `disabled`}>
                        <div class="card__repeat-days-inner">
                        ${Object.keys(this._repeatingDays).map((day) =>
      `<input
                            class="visually-hidden card__repeat-day-input"
                            type="checkbox"
                            id="repeat-${day}-1"
                            name="repeat"
                            value="${day}"
                            ${this._repeatingDays[day] === true ? `checked` : ``}
                          />
                          <label class="card__repeat-day" for="repeat-${day}-1"
                            >${day}</label
                          >`).join(``)}
                        </div>
                      </fieldset>
                    </div>
                    <div class="card__hashtag">
                      <div class="card__hashtag-list">
                        ${Array.from(this._tags).map((tag) => this._getTagTemplate(tag)).join(``)}
                      </div>
                      <label>
                        <input
                          type="text"
                          class="card__hashtag-input"
                          name="hashtag-input"
                          placeholder="Type new hashtag here"
                        />
                      </label>
                    </div>
                  </div>
                  <div class="card__colors-inner">
                    <h3 class="card__colors-title">Color</h3>
                    <div class="card__colors-wrap">
                      ${colors.map((existedColor) =>
      `<input
                          type="radio"
                          id="color-${existedColor}-1"
                          class="card__color-input card__color-input--${existedColor} visually-hidden"
                          name="color"
                          value="${existedColor}"
                          ${existedColor === this._color ? `checked` : ``}
                        />
                        <label
                          for="color-${existedColor}-1"
                          class="card__color card__color--${existedColor}"
                          >${this._color}</label
                        >`).join(``)}
                    </div>
                  </div>
                </div>
                <div class="card__status-btns">
                  <button class="card__save" type="submit">save</button>
                  <button class="card__delete" type="button">delete</button>
                </div>
              </div>
            </form>
          </article>`;
  }
}
