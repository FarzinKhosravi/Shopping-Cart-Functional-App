import {
  showCartModal,
  hideCartModal,
  cartConfirm,
  cartClear,
  DOMProducts,
  cart,
  backdrop,
  cartClearBtn,
  cartConfirmBtn,
} from "./ShoppingCart.js";

cart.addEventListener("click", showCartModal);
backdrop.addEventListener("click", hideCartModal);
cartConfirmBtn.addEventListener("click", cartConfirm);
cartClearBtn.addEventListener("click", cartClear);
document.addEventListener("DOMContentLoaded", DOMProducts);
