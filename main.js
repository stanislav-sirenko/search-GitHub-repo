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

const debounce = (fn, debounceTime) => {
  let timer;
  return function () {
    const fnCall = () => fn.apply(this, arguments);
    clearTimeout(timer);
    timer = setTimeout(fnCall, debounceTime);
  };
};

function loadUsers() {
  searchList.innerHTML = "";
  if (searchInput.value) usersRequest(searchInput.value);
}

function usersRequest(searchValue) {
  try {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
      .then((response) => {
        response.json().then((response) => {
          searchList.innerHTML = "";
          try {
            response.items.forEach((repositories) => {
              userCreation(repositories);
            });
          } catch (e) {
            console.log(`?????????????????? ???????????????????? ????????????????! 
${e}`);
          }
        });
      })
      .catch((error) => console.log("????????????: " + error));
  } catch (error) {
    console.log("????????????: " + error);
  }
}

searchInput.addEventListener("input", debounce(loadUsers, 500));
