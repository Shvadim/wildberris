const search = function () {
  const inputText = document.querySelector(".search-block > input");
  const btnSearch = document.querySelector(".search-block > button");

  inputText.addEventListener("input", (event) => {
    // Выводит все содержимое объекта ввода
    console.log(event.target.value);
  });

  btnSearch.addEventListener("click", () => {
    console.log(inputText.value);
  });
};

search();
