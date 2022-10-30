function createEl(elTag, elClass) {
  let element = document.createElement(elTag);
  if (elClass) element.classList.add(elClass);
  return element;
}

function createUs(data) {
  let usCheck = createEl("li", "check-prev");
  usCheck.innerHTML = `${data.name}`;
  let res = searchCounter.appendChild(usCheck);

  res.addEventListener("click", function () {
    let addUs = createEl("li", "add-user");
    addUs.innerHTML = `<ul class="add-el"><li>Name: ${data.name}</li><li>Owner: ${data.owner.login}</li><li>Stars: ${data.stargazers_count}</li></ul><input class="image-button" type="image" src="./delete.svg"></input>`;
    usersList.appendChild(addUs);
    document.querySelectorAll(".image-button").forEach((e) => {
      e.addEventListener("click", () => e.parentElement.remove());
    });
    searchCounter.innerHTML = "";
    searchInput.value = "";
  });
}

let bgr = document.querySelector(".background");

let wrap = createEl("div", "wrap");
bgr.appendChild(wrap);

let app = createEl("h1", "app");
wrap.appendChild(app);
app.textContent = "GitHub search repo...";
app.style.textAlign = "center";

let searchLine = createEl("div", "search-line");
wrap.appendChild(searchLine);

let searchInput = createEl("input", "search-input");
searchLine.appendChild(searchInput);

let searchCounter = createEl("ul", "check-counter");
searchLine.appendChild(searchCounter);

let usersList = createEl("ul", "users");
wrap.appendChild(usersList);

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

function loadUsers() {
  if (searchInput.value) {
    searchCounter.innerHTML = "";
    usersRequest(searchInput.value);
  } else {
    searchCounter.innerHTML = "";
  }
}

function usersRequest(searchValue) {
  try {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`).then((res) => {
      res.json().then((res) => {
        res.items.forEach((user) => createUs(user));
      });
    });
  } catch (e) {
    console.log("Ошибка: " + e);
  }
}

searchInput.addEventListener("keyup", debounce(loadUsers, 500));
