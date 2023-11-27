function cart() {
  // Получение кнопки Корзины
  const cartBtn = document.querySelector(".button-cart");
  // Получение модальной формы Корзины
  const cart = document.getElementById("modal-cart");
  // Получение в модальной форме Корзины компонента Х
  const closeCart = cart.querySelector(".modal-close");

  // addEventListener Позволяет присвоить одному событию несколько функций (будут выполняться друг за другом)
  // Присваивание клику на кнопку Корзина отображения модальной формы Корзины
  cartBtn.addEventListener("click", () => {
    cart.style.display = "flex";
  });
  // Присваивание клику по кнопке закрытия модальной формы Корзины - спрятать форму
  closeCart.addEventListener("click", () => {
    cart.style.display = "";
  });
}

cart();
