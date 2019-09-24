import Statistic from '../components/statistic';
import flatpickr from 'flatpickr';
import moment from 'moment';
import chart from 'chart.js';

import {hideVisually, Position, render, showVisually} from "../utils";

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = new Statistic();
    this._tasks = [];
    this._init();
  }

  _init() {
    render(this._container, this._statistic.getElement(), Position.BEFOREEND);
    this._initDatePicker();
    this.hide();
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._initCharts(tasks);
  }

  show(tasks) {
    if (tasks) {
      this.setTasks(tasks);
    }

    showVisually(this._statistic.getElement());
  }

  hide() {
    hideVisually(this._statistic.getElement());
  }

  _initDatePicker() {
    const dateInput = this._statistic.getElement().querySelector('.statistic__period-input');
    const today = moment();

    flatpickr(dateInput, {
      mode: "range",
      dateFormat: "Y-m-d",
      defaultDate: [today.startOf('week').toDate(), today.endOf('week').toDate()],
      onChange: (selectedDates) => {
        if (selectedDates.length !== 2) {
          return;
        }

        let [minDate, maxDate] = selectedDates;
        let minTimestamp = minDate.getTime(), maxTimestamp = maxDate.getTime();

        const tasks = this._tasks.filter((task) => task.dueDate >= minTimestamp && task.dueDate <= maxTimestamp);

        // TODO: обновить статистику
        console.log(tasks);
        this._initCharts(tasks);
      }
    });
  }

  _initCharts(tasks) {
    this._updateCount(tasks.length);
  }

  _updateCount(count) {
    const countEl = this._statistic.getElement().querySelector(`.statistic__task-found`);
    countEl.firstChild.remove();
    countEl.append(count);
  }
}
