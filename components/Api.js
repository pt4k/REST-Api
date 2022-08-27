export default class Api {
  constructor({ baseUrl, headers, limit, currentPage }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
    this._limit = limit;
    this._currentPage = currentPage;
  }

  //получить ответ
  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  //получаем массив постов
  getInitialPosts() {
    return fetch(
      this._baseUrl +
        `/posts?_limit=${this._limit}` +
        `&_page=${this._currentPage}`,
      {
        method: 'GET',
        headers: this._headers,
      }
    ).then(this._handleResponse);
  }

  getInitialComments(postId) {
    return fetch(this._baseUrl + '/comments?postId=' + `${postId}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._handleResponse);
  }

  // удаление поста
  deletePost(postId) {
    return fetch(this._baseUrl + `/posts/${postId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._handleResponse);
  }

  //Добавление нового поста
  addNewPost(newPost) {
    return fetch(this._baseUrl + '/posts', {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        title: newPost.title,
        body: newPost.body,
      }),
    }).then(this._handleResponse);
  }
}
