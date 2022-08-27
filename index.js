import Section from './components/Section.js';
import Post from './components/Post.js';
import PopupWithForm from './components/PopupWithForm.js';
import PopupWithPost from './components/PopupWithPost.js';
import Api from './components/Api.js';
import Comment from './components/Comment.js';
import {
  nextButton,
  backButton,
  addButton,
  inputSearch,
} from './utils/constants.js';

let currentPage = 1;
let limit = 10;

//получение массива постов
const api = new Api({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
  limit: limit,
  currentPage: currentPage,
});

const postList = new Section(
  {
    renderer: (post) => {
      const postElement = createPost(post);
      postList.addItem(postElement);
    },
  },
  '.posts'
);

const commentList = new Section(
  {
    renderer: (comment) => {
      const commentElement = createComment(comment);
      commentList.addItem(commentElement);
    },
  },
  '.comments'
);

api
  .getInitialPosts()
  .then((res) => {
    postList.renderItems(res);
  })
  .catch((err) => console.log(err));

// создание поста
const createPost = (item) => {
  const post = new Post({
    data: item,
    postSelector: '.element-template',

    handlePostClick: (title, body, id) => {
      commentList.clearContainer();
      api
        .getInitialComments(id)
        .then((res) => {
          commentList.renderItems(res);
        })
        .catch((err) => console.log(err));

      popupViewPost.open({ title, body, id });
    },

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

const createComment = (item) => {
  const comment = new Comment({
    data: item,
    commentSelector: '.comments-template',
  });
  return comment.generateComment();
};

// поиск совпадение в заголовке и тексте поста
inputSearch.oninput = function () {
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

// попап добавления поста
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

//попап просмотра поста и комментариев
const popupViewPost = new PopupWithPost('.popup_view_post');

// добавление 10-ти новых постов и удаление старых
const handleNextButton = () => {
  postList.clearContainer();
  if (currentPage < 10) {
    currentPage++;
  } else {
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

// возырат предыдущих 10-ти постов и удаление действующих
const handleBackButton = () => {
  postList.clearContainer();
  if (currentPage > 1) {
    currentPage--;
  } else {
    currentPage = 10;
  }
};

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

// вызов попапа добавления нового поста
addButton.addEventListener('click', () => {
  popupAddPost.open();
});

popupAddPost.setEventListeners();
popupViewPost.setEventListeners();
