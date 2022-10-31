const backgroundImage = elementCreation("div", "background-image");
document.body.appendChild(backgroundImage);

const wrapperElement = elementCreation("div", "wrapper-element");
backgroundImage.appendChild(wrapperElement);

const infoElement = elementCreation("h1", "info-element");
wrapperElement.appendChild(infoElement);
infoElement.textContent = "GitHub search repo...";

const searchLine = elementCreation("div", "search-line");
wrapperElement.appendChild(searchLine);

const searchInput = elementCreation("input", "search-input");
searchInput.setAttribute("type", "search");
searchLine.appendChild(searchInput);

const searchList = elementCreation("ul", "check-counter");
searchLine.appendChild(searchList);

const usersList = elementCreation("ul", "users-list");
wrapperElement.appendChild(usersList);

function elementCreation(elementTag, ellementClass) {
  let element = document.createElement(elementTag);
  if (ellementClass) element.classList.add(ellementClass);
  return element;
}

function userCreation(dataUser) {
  console.log(dataUser);
  let userCheck = elementCreation("li", "check-prev");
  userCheck.innerHTML = `${dataUser.name}`;
  let cardList = searchList.appendChild(userCheck);

  cardList.addEventListener("click", function () {
    let addCard = elementCreation("li", "add-list");
    addCard.innerHTML = `<ul class="add-card"><li>Name: ${dataUser.name}</li><li>Owner: ${dataUser.owner.login}</li><li>Stars: ${dataUser.stargazers_count}</li></ul><input class="image-button" type="image" src="./src/delete.svg"></input>`;
    usersList.appendChild(addCard);
    document.querySelectorAll(".image-button").forEach((event) => {
      event.addEventListener("click", () => event.parentElement.remove());
    });
    searchList.innerHTML = "";
    searchInput.value = "";
  });
}

function debounce(fn, debounceTime) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
}

function loadUsers() {
  if (searchInput.value) {
    searchList.innerHTML = "";
    usersRequest(searchInput.value);
  } else {
    searchList.innerHTML = "";
  }
}

function usersRequest(searchValue) {
  try {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
      .then((response) => {
        response.json().then((response) => {
          response.items.forEach((repositories) => {
            console.log(repositories);
            userCreation(repositories);
          });
        });
      })
      .catch((error) => console.log("Ошибка: " + error));
  } catch (error) {
    console.log("Ошибка: " + error);
  }
}

searchInput.addEventListener("input", debounce(loadUsers, 500));
