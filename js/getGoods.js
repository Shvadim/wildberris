const getGoods = () => {
  const links = document.querySelectorAll(".navigation-link");
  const getData = () => {
    fetch(
      "https://wberri-default-rtdb.europe-west1.firebasedatabase.app/db.json"
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      getData();
    });
  });

  // Работа с localStorage
  localStorage.setItem("goods", JSON.stringify([1, 2, 23]));
  let goods = JSON.parse(localStorage.getItem("goods"));
  console.log(localStorage);
  localStorage.removeItem("goods");
  console.log(localStorage);
  // ---------------------
};

getGoods();
