const search = function () {
  const inputText = document.querySelector('.search-block > input')
  const btnSearch = document.querySelector('.search-block > button')

  // Функция отрисовки товаров (с фильтрацией)
  const renderGoods = goods => {
    const goodsContainer = document.querySelector('.long-goods-list')
    goodsContainer.innerHTML = ''

    goods.forEach(good => {
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
  const getData = value => {
    fetch('https://wberri-default-rtdb.europe-west1.firebasedatabase.app/db.json')
      .then(res => res.json())
      .then(data => {
        let array = data.filter(good => good.name.toLowerCase().includes(value.toLowerCase()))

        localStorage.setItem('goods', JSON.stringify(array))
        if (window.location.pathname !== 'goods.html') {
          window.location.href = 'goods.html'
        } else {
          renderGoods(array)
        }
      })
  }

  try {
    btnSearch.addEventListener('click', () => {
      getData(inputText.value)
    })
  } catch (e) {
    console.error(e.message)
  }
}

search()
