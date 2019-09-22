export const Position = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.insertAdjacentHTML(`afterbegin`, template);
  return newElement.firstChild;
};

// Рендер и анрендер для компонент
export const render = (container, element, place) => {
  switch (place) {
    case Position.AFTERBEGIN:
      container.prepend(element);
      break;
    case Position.BEFOREEND:
      container.append(element);
      break;
  }
};

export const unrender = (element) => {
  if (element) {
    element.remove();
  }
};

export const hideVisually = (HTMLElement) => HTMLElement.classList.add(`visually-hidden`);

export const showVisually = (HTMLElement) => HTMLElement.classList.remove(`visually-hidden`);

export const isEscBtn = (key) => key === `Escape` || key === `Esc`;

export const isEnterBtn = (key) => key === `Enter`;
