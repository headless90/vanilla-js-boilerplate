let cart = [];

async function loadProducts() {
  const res = await fetch("https://opensheet.elk.sh/2PACX-1vS5bE9ljyhUyQ5OxoWwKYOrGomO5eT5Iq8FpfP8rLaSIj9BU2KmmJ9McryHlGHOxLmsOFWJk3DeguQt/Sheet1");
  const products = await res.json();

  const categories = [...new Set(products.map(p => p.category))];

  const categoriesDiv = document.getElementById("categories");
  categoriesDiv.innerHTML = categories.map(cat => `<button onclick="showCategory('${cat}')">${cat}</button>`).join(" ");

  window.allProducts = products;
  showCategory(categories[0]);
}

function showCategory(category) {
  const products = window.allProducts.filter(p => p.category === category);

  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = products.map(p => `
    <div class="product">
      <img src="${p.photo}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <b>${p.price} ₽</b><br>
      <button onclick='addToCart(${JSON.stringify(p)})'>Добавить</button>
    </div>
  `).join("");
}

function addToCart(product) {
  const index = cart.findIndex(p => p.name === product.name);
  if (index >= 0) {
    cart[index].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById("cart");
  if (cart.length === 0) {
    cartDiv.innerHTML = "<i>Корзина пуста</i>";
    return;
  }

  cartDiv.innerHTML = cart.map(item => `
    <div>
      ${item.name} × ${item.quantity} — ${item.price * item.quantity} ₽
    </div>
  `).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  cartDiv.innerHTML += `<hr><b>Итого: ${total} ₽</b>`;
}

function checkout() {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const data = {
    items: cart,
    total: total
  };
  Telegram.WebApp.sendData(JSON.stringify(data));
}
