const nextButton = document.querySelector('.navigation__button-next');
const backButton = document.querySelector('.navigation__button-back');
let currentPage = 1;
const limit = 10;

// разбить на компоненты Section, Post, Api
class Section {
  constructor({ renderer }, containerSelector) {
    this._renderer = renderer;
    this._container = document.querySelector(containerSelector);
  }

  renderItems(items) {
    this._initialArray = items;
    this._initialArray.forEach((item) => {
      this._renderer(item);
    });
  }

  addItem(item) {
    this._container.append(item);
  }

  clearContainer() {
    //альтернатива innerHTML
    this._container.innerHTML = '';
  }
}

class Post {
  constructor({ data, postSelector }) {
    this._title = data.title;
    this._body = data.body;
    this._id = data.id;
    this._userId = data.userId;
    this._postSelector = postSelector;
  }

  _getTemplate() {
    const postElement = document
      .querySelector(this._postSelector)
      .content.querySelector('.element')
      .cloneNode(true);
    return postElement;
  }

  generatePost() {
    this._post = this._getTemplate();

    this._post.querySelector('.element__title').textContent = this._title;
    this._post.querySelector('.element__text').textContent = this._body;

    return this._post;
  }

  postDelete() {
    this._post.remove();
    this._post = null;
  }
}

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
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
    return fetch(this._baseUrl, {
      method: 'GET',
      headers: this._headers,
    }).then(this._handleResponse);
  }
}

const api = new Api({
  baseUrl:
    'https://jsonplaceholder.typicode.com/posts' +
    `?_limit=${limit}` +
    `&_page=${currentPage}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api
  .getInitialPosts()
  .then((res) => {
    postList.renderItems(res);
  })
  .catch((err) => console.log(err));

const postList = new Section(
  {
    renderer: (post) => {
      const postElement = createPost(post);
      postList.addItem(postElement);
    },
  },
  '.posts'
);

const createPost = (item) => {
  const post = new Post({
    data: item,
    postSelector: '.element-template',
  });
  return post.generatePost();
};

const handleNextButton = (e) => {
  postList.clearContainer();
  if (currentPage < 10) {
    currentPage++;
  } else {
    //не нравиться решение, нужно что нибудь отобразить что уже пришли все данные
    currentPage = 1;
  }
};

const handleBackButton = (e) => {
  postList.clearContainer();
  if (currentPage > 1) {
    currentPage--;
  } else {
    //не нравиться решение, нужно что нибудь отобразить что уже пришли все данные
    currentPage = 1;
  }
};

nextButton.addEventListener('mousedown', () => {
  handleNextButton();

  fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${currentPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      postList.renderItems(json);
    })
    .catch((err) => console.log(err));
});

backButton.addEventListener('mousedown', () => {
  handleBackButton();

  fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${currentPage}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => res.json())
    .then((json) => {
      postList.renderItems(json);
    })
    .catch((err) => console.log(err));
});
