import Products from "./Products.js";
import {
  saveProducts,
  getProducts,
  saveCart,
  getCart,
  removeCart,
} from "./LocalStorage.js";

// Selectors :

const productsContainer = document.querySelector(".container-products");
const cart = document.querySelector(".nav__icon");
const cartProductsWrapper = document.querySelector(".cart__products-wrapper");
const counter = document.querySelector(".nav__cart-counter");
const totalPriceCart = document.querySelector(".cart__price-numerical-value");
const cartConfirmBtn = document.querySelector(".cart__confirm-btn");
const cartClearBtn = document.querySelector(".cart__clear-btn");

const cartModal = document.querySelector(".cart");
const backdrop = document.querySelector(".backdrop");

let cartProducts = [];

// Functions :

// DOM :
function DOMProducts() {
  // Sets values of the cart that already exist :
  setupApp();

  showProductsDOM();

  // Buttons that were disabled before, will remain disabled after the program is loaded :
  disabledButtonsDOM();

  selectProductsButtons();

  // Action to increase, decrease and remove products in the cart :
  cartLogic();
}

function setupApp() {
  cartProducts = getCart();
  cartProductsDOM(cartProducts);
  setCartAmount(cartProducts);
}

function disabledButtonsDOM() {
  const addProductBtns = [
    ...productsContainer.querySelectorAll(".product-card__btn"),
  ];

  cartProducts = getCart();

  cartProducts.forEach((product) => {
    const id = product.id;

    const disabledButtons = addProductBtns.filter(
      (btn) => btn.dataset.id == id
    );

    disabledButtons.forEach((btn) => {
      btn.disabled = true;
      btn.lastElementChild.textContent = "In Cart";
    });
  });
}

function cartProductsDOM(cart) {
  cart.forEach((product) => {
    const cartProduct = document.createElement("div");
    cartProduct.classList.add("cart__product-card");
    cartProduct.setAttribute("data-id", `${product.id}`);

    const cartProductHTML = `
      <div class="cart__product-image-wrapper">
      <img
        class="cart__product-image"
        src=${product.imageURLJpeg}
        alt="product card 01"
      />
    </div>
    <div class="cart__product-specs">
      <span class="cart__title">${product.title}</span>
      <span class="cart__price">${product.price}</span>
    </div>
    <div class="cart__product-quantity">
      <span class="cart__increment-icon" data-id="${product.id}">
        <i class="fas fa-chevron-up"></i>
      </span>
      <span class="cart__quantity">${product.quantity}</span>
      <span class="cart__decrement-icon" data-id="${product.id}">
        <i class="fas fa-chevron-down"></i>
      </span>
    </div>
    <div class="cart__product-delete">
      <span class="cart__remove-icon" data-id="${product.id}">
        <i class="fas fa-trash"></i>
      </span>
    </div>
      `;

    cartProduct.innerHTML = cartProductHTML;

    cartProductsWrapper.appendChild(cartProduct);
  });
}

function showProductsDOM() {
  saveProducts(Products);

  const products = getProducts();

  products.forEach((productItem) => {
    const product = document.createElement("div");
    product.classList.add("product-card");

    const productHTML = `
    <div class="product-card__image">
    <picture>
      <source
        type="image/webp"
        srcset=${productItem.imageURLWebp}
      />
      <source
        type="image/jpeg"
        srcset=${productItem.imageURLJpeg}
      />
      <img
        src=${productItem.imageURLJpeg}
        alt="product card 01"
      />
    </picture>
  </div>
  <div class="product-card__specs">
    <span class="product-card__price">${productItem.price}</span>
    <span class="product-card__name">${productItem.title}</span>
  </div>
  <div class="product-card__add">
    <button type="button" class="product-card__btn" data-id="${productItem.id}">
      <span class="product-card__btn-icon">
        <i class="fas fa-cart-plus"></i>
      </span>
      <span class="product-card__btn-text"> add to cart </span>
    </button>
  </div>
    `;

    product.innerHTML = productHTML;

    productsContainer.appendChild(product);
  });
}

function selectProductsButtons() {
  const addProductBtns = [
    ...productsContainer.querySelectorAll(".product-card__btn"),
  ];

  cartProducts = getCart();

  addProductBtns.forEach((btn) => {
    const id = btn.dataset.id;
    btn.addEventListener("click", () => {
      disableProductButton(id);
      addProductToCart(id);
      setCartAmount(cartProducts);
    });
  });
}

function cartLogic() {
  cartProductsWrapper.addEventListener("click", (event) => {
    const classList = event.target.classList;
    const id = event.target.dataset.id;

    if (classList.contains("cart__increment-icon")) {
      productIncrementQuantity(id);
      cartProducts = getCart();
      setCartAmount(cartProducts);
    } else if (classList.contains("cart__decrement-icon")) {
      productDecrementQuantity(id);

      cartProducts = getCart();
      const cartProduct = cartProducts.find((product) => product.id == id);

      setCartAmount(cartProducts);

      if (cartProduct.quantity < 1) {
        enableProductButton(id);
        removeCartProduct(id);
        removeCart(id, cartProducts);
      }
    } else if (classList.contains("cart__remove-icon")) {
      enableProductButton(id);
      productZeroQuantity(id);
      cartProducts = getCart();
      setCartAmount(cartProducts);
      removeCartProduct(id);
      removeCart(id, cartProducts);
    }
  });
}

function setCartAmount(cart) {
  let cartCounter = 0;

  const totalPrice = cart.reduce((acc, curr) => {
    cartCounter += curr.quantity;
    return curr.quantity * curr.price + acc;
  }, 0);

  totalPriceCart.textContent = totalPrice.toFixed(2);

  counter.innerHTML = cartCounter;
}

function disableProductButton(id) {
  const addProductBtns = [
    ...productsContainer.querySelectorAll(".product-card__btn"),
  ];

  const selectedButton = addProductBtns.find((btn) => btn.dataset.id == id);

  selectedButton.lastElementChild.textContent = "In Cart";

  selectedButton.disabled = true;
}

function addProductToCart(id) {
  const products = getProducts();

  const product = products.find((product) => product.id == id);

  cartProducts = getCart();

  cartProducts = cartProducts.filter((product) => product.quantity !== 0);

  // Added Product To Cart :
  const addedProduct = { ...product, quantity: 1 };

  // Products in Cart :
  cartProducts = [...cartProducts, addedProduct];

  const cartProduct = document.createElement("div");
  cartProduct.classList.add("cart__product-card");
  cartProduct.setAttribute("data-id", `${product.id}`);

  const cartProductHTML = `
    <div class="cart__product-image-wrapper">
    <img
      class="cart__product-image"
      src=${addedProduct.imageURLJpeg}
      alt="product card 01"
    />
  </div>
  <div class="cart__product-specs">
    <span class="cart__title">${addedProduct.title}</span>
    <span class="cart__price">${addedProduct.price}</span>
  </div>
  <div class="cart__product-quantity">
    <span class="cart__increment-icon" data-id="${addedProduct.id}">
      <i class="fas fa-chevron-up"></i>
    </span>
    <span class="cart__quantity">${addedProduct.quantity}</span>
    <span class="cart__decrement-icon" data-id="${addedProduct.id}">
      <i class="fas fa-chevron-down"></i>
    </span>
  </div>
  <div class="cart__product-delete">
    <span class="cart__remove-icon" data-id="${addedProduct.id}">
      <i class="fas fa-trash"></i>
    </span>
  </div>
    `;

  cartProduct.innerHTML = cartProductHTML;

  cartProductsWrapper.appendChild(cartProduct);

  saveCart(cartProducts);
}

function cartConfirm() {
  alert("Thank you for your purchase :)");
  hideCartModal();
}

function cartClear() {
  cartProducts = getCart();
  cartProducts = [];

  enableProductsButtons();
  setCartAmount(cartProducts);
  clearCartProducts();
  saveCart(cartProducts);
}

function enableProductsButtons() {
  const textProductBtns = [
    ...document.querySelectorAll(".product-card__btn-text"),
  ];

  const addProductBtns = [...document.querySelectorAll(".product-card__btn")];

  textProductBtns.forEach((btn) => {
    btn.textContent = "add to cart";
  });

  addProductBtns.forEach((btn) => {
    btn.disabled = false;
  });
}

function clearCartProducts() {
  cartProductsWrapper.innerHTML = "";
}

function productIncrementQuantity(id) {
  const productsCart = [
    ...cartProductsWrapper.querySelectorAll(".cart__product-card"),
  ];

  const cartProduct = productsCart.find((product) => product.dataset.id == id);

  const cartProductCounter = cartProduct.querySelector(".cart__quantity");

  cartProducts = getCart();
  const product = cartProducts.find((product) => product.id == id);

  product.quantity++;

  saveCart(cartProducts);

  cartProductCounter.textContent = product.quantity;
}

function productDecrementQuantity(id) {
  const productsCart = [
    ...cartProductsWrapper.querySelectorAll(".cart__product-card"),
  ];

  const product = productsCart.find((product) => product.dataset.id == id);

  const cartProductCounter = product.querySelector(".cart__quantity");

  cartProducts = getCart();
  const cartProduct = cartProducts.find((product) => product.id == id);

  cartProduct.quantity--;

  saveCart(cartProducts);

  cartProductCounter.textContent = cartProduct.quantity;
}

function removeCartProduct(id) {
  const cartProducts = [...cartProductsWrapper.children];

  const cartProduct = cartProducts.find((product) => product.dataset.id == id);

  cartProduct.remove();
}

function enableProductButton(id) {
  const productBtns = [
    ...productsContainer.querySelectorAll(".product-card__btn"),
  ];

  const productBtn = productBtns.find((btn) => btn.dataset.id == id);

  productBtn.disabled = false;

  productBtn.lastElementChild.textContent = "add to cart";
}

function productZeroQuantity(id) {
  cartProducts = getCart();

  const cartProduct = cartProducts.find((product) => product.id == id);

  cartProduct.quantity = 0;

  saveCart(cartProducts);
}

function showCartModal() {
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";

  backdrop.style.display = "block";
}

function hideCartModal() {
  cartModal.style.opacity = "0";
  cartModal.style.top = "-140%";

  backdrop.style.display = "none";
}

export {
  showCartModal,
  hideCartModal,
  cartConfirm,
  cartClear,
  DOMProducts,
  cart,
  backdrop,
  cartClearBtn,
  cartConfirmBtn,
};
