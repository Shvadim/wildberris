function cart() {
  // Получение кнопки Корзины
  const cartBtn = document.querySelector(".button-cart");
  // Получение модальной формы Корзины
  const cart = document.getElementById("modal-cart");

  const goodsContainer = document.querySelector(".long-goods-list");
  const cartTable = document.querySelector(".cart-table__goods");
  const cartTotal = document.querySelector(".card-table__total");
  const modalForm = document.querySelector(".modal-form");

  const modalInputs = document.querySelectorAll(".modal-input");

  // addEventListener Позволяет присвоить одному событию несколько функций (будут выполняться друг за другом)
  // Присваивание клику на кнопку Корзина отображения модальной формы Корзины
  cartBtn.addEventListener("click", () => {
    const cartArray = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    renderCartGoods(cartArray);
    cart.style.display = "flex";
  });
  // Присваивание клику по кнопке закрытия модальной формы Корзины - спрятать форму
  document.addEventListener("click", ({ target }) => {
    if (
      !target.closest(".overlay") ||
      (target.closest(".modal") && !target.classList.contains("modal-close"))
    ) {
      return;
    }
    cart.style.display = "";
  });

  const plusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.map((item) => {
      if (item.id === id) {
        item.count++;
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const minusCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.map((item) => {
      if (item.id === id) {
        item.count > 0 ? item.count-- : 0;
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const deleteCartItem = (id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const newCart = cart.filter((good) => good.id !== id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    renderCartGoods(JSON.parse(localStorage.getItem("cart")));
  };

  const addToCart = (id) => {
    const goods = JSON.parse(localStorage.getItem("goods"));
    const clickedGood = goods.find((item) => item.id === id);

    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];

    if (cart.some((item) => item.id === clickedGood.id)) {
      cart.map((item) => {
        if (item.id === clickedGood.id) {
          item.count++;
        }
        return item;
      });
    } else {
      clickedGood.count = 1;
      cart.push(clickedGood);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const renderCartGoods = (goods) => {
    let total = 0;
    cartTable.innerHTML = "";
    goods.forEach((good) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `      
						<td>${good.name}</td>
						<td>${good.price}$</td>
						<td><button class="cart-btn-minus"">-</button></td>
						<td>${good.count}</td>
						<td><button class=" cart-btn-plus"">+</button></td>
						<td>${+good.price * +good.count}$</td>
						<td><button class="cart-btn-delete"">x</button></td>
      `;
      cartTable.append(tr);

      tr.addEventListener("click", (event) => {
        if (event.target.classList.contains("cart-btn-minus")) {
          minusCartItem(good.id);
        } else if (event.target.classList.contains("cart-btn-plus")) {
          plusCartItem(good.id);
        } else if (event.target.classList.contains("cart-btn-delete")) {
          deleteCartItem(good.id);
        }
      });
      total += good.price * good.count;
    });
    cartTotal.innerHTML = `${total}$`;
  };

  const sendForm = () => {
    const cartStorage = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    let nameCust;
    let phoneCust;
    modalInputs.forEach((item) => {
      if (item.name === "nameCustomer") {
        nameCust = item.value;
      } else if (item.name === "phoneCustomer") {
        phoneCust = item.value;
      }
    });

    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        cart: cartStorage,
        name: nameCust,
        phone: phoneCust,
      }),
    }).then(() => {
      cart.style.display = "";
      localStorage.removeItem("cart");
    });
  };

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendForm();
  });

  if (goodsContainer) {
    goodsContainer.addEventListener("click", (events) => {
      if (events.target.closest(".add-to-cart")) {
        const buttonToCart = events.target.closest(".add-to-cart");
        const goodID = buttonToCart.dataset.id;
        addToCart(goodID);
      }
    });
  }
}

cart();
