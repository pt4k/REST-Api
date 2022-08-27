export default class Post {
  constructor({
    data,
    postSelector,
    handleButtonDeleteClick,
    handlePostClick,
  }) {
    this._title = data.title;
    this._body = data.body;
    this._id = data.id;
    this._postSelector = postSelector;
    this._handleButtonDeleteClick = handleButtonDeleteClick;
    this._handlePostClick = handlePostClick;
  }

  // клонирование разметки template тега
  _getTemplate() {
    const postElement = document
      .querySelector(this._postSelector)
      .content.querySelector('.element')
      .cloneNode(true);
    return postElement;
  }

  // создание поста
  generatePost() {
    this._post = this._getTemplate();
    this._deleteButton = this._post.querySelector('.element__button-delete');

    this._post.querySelector('.element__title').textContent = this._title;
    this._post.querySelector('.element__text').textContent = this._body;

    this._setEventListeners();

    return this._post;
  }

  // удаление поста
  postDelete() {
    this._post.remove();
    this._post = null;
  }

  // слушатели для кнопок удаления и открытия попапа просмотра поста
  _setEventListeners() {
    this._deleteButton.addEventListener('click', (evt) => {
      evt.stopPropagation();
      this._handleButtonDeleteClick(this);
    });

    this._post.addEventListener('click', () => {
      this._handlePostClick(this._title, this._body, this._id);
    });
  }
}
