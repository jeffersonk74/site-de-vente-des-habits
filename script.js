// ===============================
// 📌 Données produits (simulation)
// ===============================
const products = [
  {
    id: 1,
    name: "T-shirt oversize",
    category: "T-shirts",
    size: "M",
    price: 25,
    popularity: 120,
    image: "assets/tshirt1.jpg"
  },
  {
    id: 2,
    name: "Pantalon slim",
    category: "Pantalons",
    size: "L",
    price: 45,
    popularity: 90,
    image: "assets/pantalon1.jpg"
  },
  {
    id: 3,
    name: "Robe élégante",
    category: "Robes",
    size: "S",
    price: 75,
    popularity: 180,
    image: "assets/robe1.jpg"
  },
  {
    id: 4,
    name: "Veste en jean",
    category: "Vestes",
    size: "M",
    price: 60,
    popularity: 150,
    image: "assets/veste1.jpg"
  },
  {
    id: 5,
    name: "T-shirt graphique",
    category: "T-shirts",
    size: "L",
    price: 30,
    popularity: 200,
    image: "assets/tshirt2.jpg"
  }
];

// ===============================
// 📌 Gestion du panier
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="text-gray-500">Votre panier est vide</p>`;
    cartCount.textContent = 0;
    cartTotal.textContent = "0,00 €";
    return;
  }

  let total = 0;
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-4";

    div.innerHTML = `
      <div class="flex items-center space-x-4">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded object-cover">
        <div>
          <h4 class="font-medium">${item.name}</h4>
          <p class="text-sm text-gray-500">${item.price} €</p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button onclick="changeQty(${index}, -1)" class="px-2 bg-gray-200 rounded">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)" class="px-2 bg-gray-200 rounded">+</button>
        <button onclick="removeFromCart(${index})" class="text-red-500">✖</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);
  cartTotal.textContent = total.toFixed(2) + " €";

  saveCart();
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();

  // petite animation sur le badge
  const badge = document.getElementById("cart-count");
  badge.classList.add("cart-badge");
  setTimeout(() => badge.classList.remove("cart-badge"), 500);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCart();
}

function toggleCart() {
  document.getElementById("cart-sidebar").style.transform =
    document.getElementById("cart-sidebar").style.transform === "translateX(0%)"
      ? "translateX(100%)"
      : "translateX(0%)";

  document.getElementById("cart-overlay").classList.toggle("hidden");
}

// ===============================
// 📌 Affichage Produits
// ===============================
function displayProducts(filteredProducts) {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = "";

  if (filteredProducts.length === 0) {
    grid.innerHTML = `<p class="col-span-full text-center text-gray-500">Aucun produit trouvé</p>`;
    return;
  }

  filteredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card bg-white rounded-lg shadow hover:shadow-lg overflow-hidden";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover">
      <div class="p-4">
        <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
        <p class="text-gray-600 mb-4">${product.price} €</p>
        <button onclick="addToCart(${product.id})" class="w-full btn-primary">Ajouter au panier</button>
      </div>
    `;

    grid.appendChild(card);
  });
}

// ===============================
// 📌 Filtres + Recherche + Tri
// ===============================
function filterProducts() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const category = document.getElementById("filter-category").value;
  const size = document.getElementById("filter-size").value;
  const price = document.getElementById("filter-price").value;
  const sortBy = document.getElementById("sort-by").value;

  let result = products.filter(p => {
    return (
      (category === "all" || p.category === category) &&
      (size === "all" || p.size === size) &&
      (price === "all" ||
        (price === "30" && p.price < 30) ||
        (price === "30-60" && p.price >= 30 && p.price <= 60) ||
        (price === "60-100" && p.price > 60 && p.price <= 100) ||
        (price === "100" && p.price > 100)) &&
      (p.name.toLowerCase().includes(search))
    );
  });

  if (sortBy === "asc") result.sort((a, b) => a.price - b.price);
  if (sortBy === "desc") result.sort((a, b) => b.price - a.price);
  if (sortBy === "pop") result.sort((a, b) => b.popularity - a.popularity);
  if (sortBy === "new") result.sort((a, b) => b.id - a.id);

  displayProducts(result);
}

// ===============================
// 📌 Initialisation
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  displayProducts(products);
  updateCart();

  document.getElementById("search-input").addEventListener("input", filterProducts);
  document.getElementById("filter-category").addEventListener("change", filterProducts);
  document.getElementById("filter-size").addEventListener("change", filterProducts);
  document.getElementById("filter-price").addEventListener("change", filterProducts);
  document.getElementById("sort-by").addEventListener("change", filterProducts);
});
