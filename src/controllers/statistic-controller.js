import Statistic from '../components/statistic';
import flatpickr from 'flatpickr';
import moment from 'moment';
import Chart from 'chart.js';
import 'chartjs-plugin-colorschemes/src/plugins/plugin.colorschemes';
import {Tableau20} from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {hideVisually, Position, render, showVisually} from '../utils';

export default class StatisticController {
  constructor(container) {
    this._container = container;
    this._statistic = new Statistic();
    this._tasks = [];

    this._tagsDiagram = null;
    this._colorsDiagram = null;
    this._datesDiagram = null;

    const today = moment();
    this._startDate = today.startOf(`week`).toDate();
    this._endDate = today.endOf(`week`).toDate();

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
    const dateInput = this._statistic.getElement().querySelector(`.statistic__period-input`);

    flatpickr(dateInput, {
      mode: `range`,
      dateFormat: `Y-m-d`,
      defaultDate: [this._startDate, this._endDate],
      onChange: (selectedDates) => {
        if (selectedDates.length !== 2) {
          return;
        }

        [this._startDate, this._endDate] = selectedDates;
        let minTimestamp = this._startDate.getTime();
        let maxTimestamp = this._endDate.getTime();

        const tasks = this._tasks.filter((task) => task.dueDate >= minTimestamp && task.dueDate <= maxTimestamp);

        this._initCharts(tasks);
      },
    });
  }

  _initCharts(tasks) {
    this._updateCount(tasks.length);
    this._initTagsDiagram(tasks);
    this._initColorsDiagram(tasks);
    this._initDatesDiagram(tasks);
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

    if (tasks.length === 0) {
      return;
    }

    const allTags = new Map();

    tasks.forEach((task) => {
      task.tags.forEach((tag) => {
        const count = allTags.get(tag) === undefined ? 0 : allTags.get(tag);
        allTags.set(tag, count + 1);
      });
    });

    const data = [];
    const labels = [];

    allTags.forEach((count, tag) => {
      data.push(count);
      labels.push(`#${tag}`);
    });

    this._tagsDiagram = new Chart(this._statistic.getElement().querySelector(`.statistic__tags`), {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            display: false,
          },
          colorschemes: {
            scheme: Tableau20,
          },
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chartData) => {
              const allData = chartData.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);

              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            },
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15,
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`,
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13,
          },
        },
      },
    });
  }

  _initColorsDiagram(tasks) {
    if (this._colorsDiagram) {
      this._colorsDiagram.destroy();
    }

    if (tasks.length === 0) {
      return;
    }

    const allColors = new Map();

    tasks.forEach((task) => {
      const count = allColors.get(task.color) === undefined ? 0 : allColors.get(task.color);
      allColors.set(task.color, count + 1);
    });

    const data = [];
    const labels = [];
    const colors = [];

    allColors.forEach((count, color) => {
      data.push(count);
      colors.push(color);
      labels.push(`#${color}`);
    });

    this._colorsDiagram = new Chart(this._statistic.getElement().querySelector(`.statistic__colors`), {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            display: false,
          },
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, chardData) => {
              const allData = chardData.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            },
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15,
        },
        title: {
          display: true,
          text: `DONE BY: TAGS`,
          fontSize: 16,
          fontColor: `#000000`,
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13,
          },
        },
      },
    });
  }

  _initDatesDiagram(tasks) {
    if (this._datesDiagram) {
      this._datesDiagram.destroy();
    }

    if (tasks.length === 0) {
      return;
    }

    const diff = moment(this._endDate).diff(this._startDate, `days`);

    // К diff прибавляем день отсчёта diff, чтобы включить его в результирующий массив
    const daysMock = (new Array(diff + 1)).fill(``);
    const dateCounter = moment(this._startDate);
    const daysMap = new Map();
    const mapKeyFormat = `D-M-YYYY`;

    daysMock.forEach(() => {
      daysMap.set(dateCounter.format(mapKeyFormat), {
        timestamp: dateCounter.valueOf(),
        count: 0,
      });
      dateCounter.add(1, `days`);
    });

    tasks.forEach((task) => {
      const date = moment(task.dueDate).format(mapKeyFormat);
      const day = daysMap.get(date);

      if (day) {
        day.count += 1;
      }
    });

    const days = Array.from(daysMap).map(([, dateInfo]) => {
      return dateInfo;
    });

    days.sort((a, b) => a.timestamp - b.timestamp);

    const data = [];
    const labels = [];

    days.forEach(({timestamp, count}) => {
      data.push(count);
      labels.push(moment(timestamp).format(`DD MMM`).toUpperCase());
    });

    this._datesDiagram = new Chart(this._statistic.getElement().querySelector(`.statistic__days`), {
      plugins: [ChartDataLabels],
      type: `line`,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: `transparent`,
          borderColor: `#000000`,
          borderWidth: 1,
          lineTension: 0,
          pointRadius: 8,
          pointHoverRadius: 8,
          pointBackgroundColor: `#000000`,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 8,
            },
            color: `#ffffff`,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        layout: {
          padding: {
            top: 10,
          },
        },
        tooltips: {
          enabled: false,
        },
      },
    });
  }
}
