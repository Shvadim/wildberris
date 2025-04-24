function cart() {
  // Получение кнопки Корзины
  const cartBtn = document.querySelector('.button-cart')
  // Получение модальной формы Корзины
  const cart = document.getElementById('modal-cart')

  const goodsContainer = document.querySelector('.long-goods-list')
  const cartTable = document.querySelector('.cart-table__goods')
  const cartTotal = document.querySelector('.card-table__total')
  const modalForm = document.querySelector('.modal-form')

  const modalInputs = document.querySelectorAll('.modal-input')

  // addEventListener Позволяет присвоить одному событию несколько функций (будут выполняться друг за другом)
  // Присваивание клику на кнопку Корзина отображения модальной формы Корзины
  cartBtn.addEventListener('click', () => {
    const cartArray = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    renderCartGoods(cartArray)
    cart.style.display = 'flex'
  })

  // Присваивание клику по кнопке закрытия модальной формы Корзины - спрятать форму
  document.addEventListener('click', ({ target }) => {
    if (!target.closest('.overlay') || (target.closest('.modal') && !target.classList.contains('modal-close'))) {
      return
    }
    cart.style.display = ''
  })

  // добавить количество в карточку Корзины
  const plusCartItem = id => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const newCart = cart.map(item => {
      if (item.id === id) {
        item.count++
      }
      return item
    })
    localStorage.setItem('cart', JSON.stringify(newCart))
    renderCartGoods(JSON.parse(localStorage.getItem('cart')))
  }
  // уменьшение количества в карточке Корзины
  const minusCartItem = id => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const newCart = cart.map(item => {
      if (item.id === id) {
        item.count > 0 ? item.count-- : 0
      }
      return item
    })
    localStorage.setItem('cart', JSON.stringify(newCart))
    renderCartGoods(JSON.parse(localStorage.getItem('cart')))
  }
  // удалить карточку с Корзины
  const deleteCartItem = id => {
    const cart = JSON.parse(localStorage.getItem('cart'))
    const newCart = cart.filter(good => good.id !== id)
    localStorage.setItem('cart', JSON.stringify(newCart))
    renderCartGoods(JSON.parse(localStorage.getItem('cart')))
  }

  // Функция добавления товара в Корзину
  const addToCart = id => {
    // получаем все сохраненные товары из localStorage
    const goods = JSON.parse(localStorage.getItem('goods'))
    // находим конкретный товар по кликнутой кнопке (используем ID товара)
    const clickedGood = goods.find(item => item.id === id)

    // получаем товары Корзины из сохраненной переменной localStorage
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []

    // проверяем записи из Корзины в localStorage на сравнение с id
    if (cart.some(item => item.id === clickedGood.id)) {
      // необходимо добавить в найденую карточку Корзины увеличение количества
      cart.map(item => {
        if (item.id === clickedGood.id) {
          item.count++
        }
        return item
      })
    } else {
      clickedGood.count = 1
      // добавляем в Корзину новую карточку
      cart.push(clickedGood)
    }
    // сохраняем в localStorage измененный массив Корзины
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  const renderCartGoods = goods => {
    let total = 0
    cartTable.innerHTML = ''
    goods.forEach(good => {
      const tr = document.createElement('tr')
      tr.innerHTML = `      
						<td>${good.name}</td>
						<td>${good.price}$</td>
						<td><button class="cart-btn-minus"">-</button></td>
						<td>${good.count}</td>
						<td><button class=" cart-btn-plus"">+</button></td>
						<td>${+good.price * +good.count}$</td>
						<td><button class="cart-btn-delete"">x</button></td>
      `
      cartTable.append(tr)

      tr.addEventListener('click', event => {
        if (event.target.classList.contains('cart-btn-minus')) {
          minusCartItem(good.id)
        } else if (event.target.classList.contains('cart-btn-plus')) {
          plusCartItem(good.id)
        } else if (event.target.classList.contains('cart-btn-delete')) {
          deleteCartItem(good.id)
        }
      })
      total += good.price * good.count
    })
    cartTotal.innerHTML = `${total}$`
  }

  const sendForm = () => {
    const cartStorage = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
    let nameCust
    let phoneCust
    // перебираем контролы с классом modal-input циклом и получаем заполненные значения в переменные
    modalInputs.forEach(item => {
      if (item.name === 'nameCustomer') {
        nameCust = item.value
      } else if (item.name === 'phoneCustomer') {
        phoneCust = item.value
      }
    })

    // отправляем на сервер массив корзины методом POST
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        cart: cartStorage,
        name: nameCust,
        phone: phoneCust,
      }),
    }).then(() => {
      // после отправки закрываем модальную форму и очищаем Корзину в localStorage
      cart.style.display = ''
      localStorage.removeItem('cart')
    })
  }

  // добавляем на кнопку событие отправки формы
  modalForm.addEventListener('submit', e => {
    e.preventDefault()
    sendForm()
  })

  // на весь контейнер с товарами вешаем событие click
  if (goodsContainer) {
    goodsContainer.addEventListener('click', events => {
      // если click выполнен на кнопке с классом add-to-cart то выполняем присваивание этого элемента в функцию addToCart
      if (events.target.closest('.add-to-cart')) {
        const buttonToCart = events.target.closest('.add-to-cart') //Возвращаем ближайший родительский элемент, который соответствует нужному CSS-селектору
        addToCart(buttonToCart.dataset.id)
      }
    })
  }
}

cart()
