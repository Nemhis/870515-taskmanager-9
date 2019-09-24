import Statistic from '../components/statistic';
import flatpickr from 'flatpickr';
import moment from 'moment';
import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import { Tableau20 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { hideVisually, Position, render, showVisually } from "../utils";

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = new Statistic();
    this._tasks = [];

    this._tagsDiagram = null;
    this._colorsDiagram = null;
    this._datesDiagram = null;

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

        this._initCharts(tasks);
      }
    });
  }

  _initCharts(tasks) {
    this._updateCount(tasks.length);
    this._initTagsDiagram(tasks);
    this._initColorsDiagram(tasks);
  }

  _updateCount(count) {
    const countEl = this._statistic.getElement().querySelector(`.statistic__task-found`);
    countEl.firstChild.remove();
    countEl.append(count);
  }

  _initTagsDiagram(tasks) {
    if (this._tagsDiagram) {
      this._tagsDiagram.destroy();
    }

    const allTags = new Map();

    tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        const count = allTags.get(tag) === undefined ? 0 : allTags.get(tag);
        allTags.set(tag, count + 1);
      });
    });

    const data = [], labels = [];

    allTags.forEach((count, tag) => {
      data.push(count);
      labels.push(`#${tag}`);
    });

    this._tagsDiagram = new Chart(this._statistic.getElement().querySelector(`.statistic__tags`), {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: labels,
        datasets: [{
          data: data,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          },
          colorschemes: {
            scheme: Tableau20
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }

  _initColorsDiagram(tasks) {
    if (this._colorsDiagram) {
      this._colorsDiagram.destroy();
    }

    const allColors = new Map();

    tasks.forEach((task) => {
      const count = allColors.get(task.color) === undefined ? 0 : allColors.get(task.color);
      allColors.set(task.color, count + 1);
    });

    const data = [], labels = [], colors = [];

    allColors.forEach((count, color) => {
      data.push(count);
      colors.push(color);
      labels.push(`#${color}`);
    });

    console.log(colors);

    this._colorsDiagram = new Chart(this._statistic.getElement().querySelector(`.statistic__colors`), {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });
  }
}
