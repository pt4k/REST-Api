const nextButton = document.querySelector('.navigation__button-next');
const backButton = document.querySelector('.navigation__button-back');
const addButton = document.querySelector('.control__add-post');
const inputSerch = document.querySelector('.control__search-input');
let currentPage = 1;
let limit = 10;

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
    this._container.prepend(item);
  }

  clearContainer() {
    this._container.innerHTML = '';
  }
}

class Post {
  constructor({ data, postSelector, handleButtonDeleteClick }) {
    this._title = data.title;
    this._body = data.body;
    this._id = data.id;
    this._userId = data.userId;
    this._postSelector = postSelector;
    this._handleButtonDeleteClick = handleButtonDeleteClick;
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
    this._deleteButton = this._post.querySelector('.element__button-delete');

    this._post.querySelector('.element__title').textContent = this._title;
    this._post.querySelector('.element__text').textContent = this._body;

    this._setEventListeners();

    return this._post;
  }

  postDelete() {
    this._post.remove();
    this._post = null;
  }

  _setEventListeners() {
    this._deleteButton.addEventListener('click', () => {
      this._handleButtonDeleteClick(this);
    });
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
    return fetch(this._baseUrl + `?_limit=${limit}` + `&_page=${currentPage}`, {
      method: 'GET',
      headers: this._headers,
    }).then(this._handleResponse);
  }
  // удаление поста
  deletePost(postId) {
    return fetch(this._baseUrl + `/${postId}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this._handleResponse);
  }

  //Добавление нового поста
  addNewPost(newPost) {
    return fetch(this._baseUrl, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        title: newPost.title,
        body: newPost.body,
      }),
    }).then(this._handleResponse);
  }
}

class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);
  }

  open() {
    this._popup.classList.add('popup_opened');
  }

  close() {
    this._popup.classList.remove('popup_opened');
  }
}

class PopupWithForm extends Popup {
  constructor({ handleFormSubmit }, popup) {
    super(popup);
    this._handleFormSubmit = handleFormSubmit;
    this._inputList = this._popup.querySelectorAll('.popup__input');
    this._form = this._popup.querySelector('.popup__form');
    this._saveButton = this._popup.querySelector('.popup__save-button');
    this._saveButtonValue = this._saveButton.textContent;
  }

  _getInputValues() {
    this._inputValues = {};

    this._inputList.forEach((input) => {
      this._inputValues[input.name] = input.value;
    });
    return this._inputValues;
  }

  setEventListeners() {
    this._form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      this._handleFormSubmit(this._getInputValues());
    });
  }

  close() {
    super.close();
    this._form.reset();
  }
}

const popupAddPost = new PopupWithForm(
  {
    handleFormSubmit: (inputData) => {
      const newPost = {
        title: inputData.title,
        body: inputData.body,
      };

      api
        .addNewPost(newPost)
        .then((data) => {
          const postElement = createPost(data);
          postList.addItem(postElement);
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          popupAddPost.close();
        });
    },
  },
  '.popup_add_post'
);

addButton.addEventListener('click', () => {
  popupAddPost.open();
});

popupAddPost.setEventListeners();

const api = new Api({
  baseUrl: 'https://jsonplaceholder.typicode.com/posts',
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
    handleButtonDeleteClick: (data) => {
      api
        .deletePost(data._id)
        .then(() => {
          data.postDelete();
        })
        .catch((err) => console.log(err));
    },
  });

  return post.generatePost();
};

const handleNextButton = () => {
  postList.clearContainer();
  if (currentPage < 10) {
    currentPage++;
  } else {
    currentPage = 1;
  }
};

const handleBackButton = () => {
  postList.clearContainer();
  if (currentPage > 1) {
    currentPage--;
  } else {
    currentPage = 10;
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

inputSerch.oninput = function () {
  let value = this.value.trim();
  let elements = document.querySelectorAll('.element');

  if (value !== ' ') {
    elements.forEach((elem) => {
      if (elem.innerText.search(value) === -1) {
        elem.classList.add('element__hidden');
      } else {
        elem.classList.remove('element__hidden');
      }
    });
  }
};
