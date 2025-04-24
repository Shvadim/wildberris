const getGoods = () => {
  const links = document.querySelectorAll('.navigation-link')
  // Получение ссылки кнопки View All
  const linkViewAll = document.querySelector('.more')

  // Функция отрисовки товаров (с фильтрацией)
  const renderGoods = goods => {
    const goodsContainer = document.querySelector('.long-goods-list')
    goodsContainer.innerHTML = ''

    goods.forEach(good => {
      // создаем элемент div в документе
      const goodBlock = document.createElement('div')
      goodBlock.classList.add('col-lg-3')
      goodBlock.classList.add('col-sm-6')

      goodBlock.innerHTML = `
      <div class="goods-card">
        <span class="label ${good.label ? null : 'd-none'}">${good.label}</span>
        <img src="db/${good.img}" alt="image: ${good.name}" class="goods-image">
        <h3 class="goods-title">${good.name}</h3>
        <p class="goods-description">${good.description}</p>
        <button class="button goods-card-btn add-to-cart" data-id="${good.id}">
          <span class="button-price">$${good.price}</span>
        </button>
      </div>
      `
      goodsContainer.append(goodBlock)
    })
  }
  // Функция получения списка товаров с сервера
  const getData = (value, category) => {
    fetch('https://wberri-default-rtdb.europe-west1.firebasedatabase.app/db.json')
      .then(res => res.json())
      .then(data => {
        let array = category ? data.filter(item => item[category] === value) : data
        localStorage.setItem('goods', JSON.stringify(array))

        if (!window.location.pathname.includes('goods.html')) {
          // переход на страницу товаров: goods.html
          window.location.href = 'goods.html'
        } else {
          renderGoods(array)
        }
      })
  }

  links.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault()
      const linkValue = link.textContent
      // в html коде записывается тегом data-field, где data - это dataset, а field - это значение поля
      // пример: <a href="#" class="navigation-link" data-field="category">Shoes</a>
      const category = link.dataset.field
      getData(linkValue, category)
    })
  })

  // Чтение из localStorage сохраненного значения атрибута goods с товарами
  // Выводится только для страницы с товарами goods.html
  if (localStorage.getItem('goods') && window.location.pathname.includes('goods.html')) {
    renderGoods(JSON.parse(localStorage.getItem('goods')))
  }

  if (linkViewAll) {
    linkViewAll.addEventListener('click', event => {
      event.preventDefault()
      getData()
    })
  }
}

getGoods()
