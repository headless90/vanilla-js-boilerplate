let allProducts = [];
let cart = [];

window.onload = () => {
  fetch('products.json')
    .then(res => res.json())
    .then(products => {
      allProducts = products;
      renderCategories(products);
      renderProducts(products);
      updateCartUI();
    });
};

function renderCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  const container = document.getElementById('categories');
  container.innerHTML = categories.map(cat => `
    <button onclick="filterByCategory('${cat}')">${cat}</button>
  `).join(' ') + `<button onclick="renderProducts(allProducts)">Все</button>`;
}

function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = products.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.price.toLocaleString()} ₽</p>
      <button onclick="addToCart('${p.id}')">В корзину</button>
    </div>
  `).join('');
}

function filterByCategory(category) {
  const filtered = allProducts.filter(p => p.category === category);
  renderProducts(filtered);
}

function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  const itemInCart = cart.find(item => item.id === productId);
  if (itemInCart) {
    itemInCart.qty += 1;
  } else {
    cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  const container = document.getElementById('cart');
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  container.innerHTML = `
    <p>🛒 В корзине: ${totalQty} товаров на сумму ${totalPrice.toLocaleString()} ₽</p>
  `;
}

function checkout() {
  if (cart.length === 0) {
    alert("Корзина пуста");
    return;
  }

  const orderText = cart.map(item => `${item.name} — ${item.qty} шт.`).join('\n');
  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const data = {
    type: "order",
    items: cart,
    total: totalPrice,
    text: orderText
  };

  // Отправка в Telegram через WebApp
  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(data));
  } else {
    alert("Это мини-приложение работает только в Telegram.");
  }
}
