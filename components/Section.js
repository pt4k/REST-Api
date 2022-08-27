export default class Section {
  constructor({ renderer }, containerSelector) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  // перебираем полученный массив и отрисовываем
  renderItems(items) {
    this._initialArray = items;
    this._initialArray.forEach((item) => {
      this._renderer(item);
    });
  }

  // добавление нового элемента в контейнер
  addItem(item) {
    this._container.prepend(item);
  }

  // очистка контейнера
  clearContainer() {
    this._container.innerHTML = '';
  }
}
