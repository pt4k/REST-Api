export default class Comment {
  constructor({ data, commentSelector }) {
    this._name = data.name;
    this._body = data.body;
    this._id = data.id;
    this._commentSelector = commentSelector;
  }

  _getTemplate() {
    const commentElement = document
      .querySelector(this._commentSelector)
      .content.querySelector('.comment')
      .cloneNode(true);

    return commentElement;
  }

  generateComment() {
    this._comment = this._getTemplate();

    this._comment.querySelector('.comment__name').textContent = this._name;
    this._comment.querySelector('.comment__text').textContent = this._body;

    return this._comment;
  }
}
