import Statistic from "../components/statistic";
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
    this._initCharts();
    this.hide();
  }

  setTasks(tasks) {
    this._tasks = tasks;
  }

  show() {
    showVisually(this._statistic.getElement());
  }

  hide() {
    hideVisually(this._statistic.getElement());
  }

  _initDatePicker() {

  }

  _initCharts() {

  }
}
