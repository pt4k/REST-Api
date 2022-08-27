import Popup from './Popup.js';

export default class PopupWithPost extends Popup {
  constructor(popup) {
    super(popup);

    this._titlePost = this._popup.querySelector('.post__title');
    this._textPost = this._popup.querySelector('.post__text');
  }

  // открытие попапа с данными поста
  open(data) {
    super.open();

    this._titlePost.textContent = data.title;
    this._textPost.textContent = data.body;
  }
}
