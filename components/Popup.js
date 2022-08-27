export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
  }
  // открыть попап
  open() {
    this._popup.classList.add('popup_opened');
  }

  //закрыть попап
  close() {
    this._popup.classList.remove('popup_opened');
  }

  //слушатели для закрытия попапа по крестику и пустому пространству
  setEventListeners() {
    this._popup.addEventListener('mousedown', (evt) => {
      if (
        evt.target.classList.contains('popup_opened') ||
        evt.target.classList.contains('popup__close-button')
      ) {
        this.close();
      }
    });
  }
}
