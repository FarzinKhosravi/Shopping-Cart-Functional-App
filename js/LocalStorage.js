function saveProducts(products) {
  localStorage.setItem("products", JSON.stringify(products));
}

function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart-products", JSON.stringify(cart));
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart-products")) || [];
}

function removeCart(id, cartProducts) {
  const removeProduct = cartProducts.find((product) => product.id == id);

  cartProducts = cartProducts.filter(
    (product) => product.id !== removeProduct.id
  );

  saveCart(cartProducts);
}

export { saveProducts, getProducts, saveCart, getCart, removeCart };
