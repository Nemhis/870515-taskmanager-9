import TaskController, {MODE as TaskControllerMode} from './task-controller';

export default class TaskListController {
  constructor(container, onDataChange) {
    this._onDataChangeMain = onDataChange;
    this._container = container;
    this._tasks = [];
    this._subscriptions = [];
    this._creatingTask = null;
  }

  setTasks(tasks) {
    this._tasks = tasks;
    this._subscriptions = [];

    this._container.innerHTML = ``;
    this._tasks.forEach((task) => this._renderTask(task));
  }

  addTasks(tasks) {
    tasks.forEach((task) => this._renderTask(task));
    this._tasks = this._tasks.concat(tasks);
  }

  _renderTask(task) {
    const taskController = new TaskController(
      this._container,
      task,
      TaskControllerMode.VIEW,
      this._onDataChange.bind(this),
      this._onChangeView.bind(this)
    );

    this._subscriptions.push(taskController.setDefaultView.bind(taskController));
  }

  _onDataChange(newData, id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (newData === null && id === null) { // выход из режима создания
      this._creatingTask = null;
    } else if (newData !== null && id === null) { // создание
      this._tasks = [newData, ...this._tasks];
      this._creatingTask = null;
    } else if (newData === null) { // удаление
      this._tasks = [...this._tasks.slice(0, index), ...this._tasks.slice(index + 1)];
    } else { // обновление
      this._tasks[index] = newData;
    }

    this.setTasks(this._tasks);
    this._onDataChangeMain(this._tasks);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }

  createTask() {
    if (this._creatingTask !== null) {
      return;
    }

    const defaultTask = {
      description: ``,
      dueDate: new Date(),
      tags: new Set(),
      color: [],
      repeatingDays: {},
      isFavorite: false,
      isArchive: false,
    };

    this._creatingTask = new TaskController(
      this._container,
      defaultTask,
      TaskControllerMode.ADDING,
      this._onDataChange.bind(this),
      this._onChangeView.bind(this)
    );
  }
}
