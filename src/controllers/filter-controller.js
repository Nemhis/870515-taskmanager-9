import Filter from "../components/filter";
import {Position, render, unrender} from "../utils";

export default class FilterController {
  constructor(container, tasks, onFilterChange) {
    this._container = container;
    this._filter = null;
    this._tasks = tasks;
    this._onFilterChange = onFilterChange;
    this._filterMap = null;

    this._init();
  }

  _init() {
    this._createFilterMap();
    this._renderFilter();
    this._initEvents();
  }

  _initEvents() {
    const inputs = Array.from(this._filter.getElement().querySelectorAll(`.filter__input`));

    inputs.forEach((input) => {
      input.addEventListener(`change`, (event) => {
        const target = event.target;

        this._onFilterChange(this._filterTasks(target.dataset.filterName, this._tasks));
      })
    });
  }

  _renderFilter() {
    this._filter = new Filter(this._createFilters(this._tasks));
    render(this._container, this._filter.getElement(), Position.BEFOREEND);
  }

  _unrenderFilter() {
    unrender(this._filter.getElement());
    this._filter.removeElement();
  }

  _reRenderFilter() {
    const newFilter = new Filter(this._createFilters(this._tasks));
    this._container.replaceChild(newFilter.getElement(), this._filter.getElement());
    this._unrenderFilter();
    this._filter = newFilter;
    this._initEvents();
  }

  updateFilter(tasks) {
    this._tasks = tasks;
    this._reRenderFilter();
  }

  _createFilterMap() {
    this._filterMap = {
      'all': (tasks) => tasks,
      'overdue': (tasks) => tasks.filter((task) => (Date.now() > task.dueDate)),
      'today': (tasks) => {
        return tasks.filter((task) => {
          const today = new Date();
          const dueDate = new Date(task.dueDate);

          return today.toDateString() === dueDate.toDateString();
        })
      },
      'favorites': (tasks) => tasks.filter((task) =>
        Object
          .keys(task.repeatingDays)
          .some(day => task.repeatingDays[day])
      ),
      'repeating': (tasks) => tasks.filter((task) =>
        Object
          .keys(task.repeatingDays)
          .some(day => task.repeatingDays[day])
      ),
      'tags': (tasks) => tasks.filter((task) => task.tags.size),
      'archive': (tasks) => tasks.filter((task) => task.isArchive),
    };
  }

  _filterTasks(filterName, tasks) {
    const counter = this._filterMap[filterName];

    return typeof counter === `function` ? counter(tasks) : tasks;
  }

  _createFilters(tasks) {
    return Object.keys(this._filterMap).map((filterName) => ({
      title: filterName,
      count: this._filterTasks(filterName, tasks).length
    }));
  };
}
