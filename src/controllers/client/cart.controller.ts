import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductInCart,
  getProductInCart,
  updateCartBeforeCheckout,
} from "../../services/client/cart.service";
import { formatPrice } from "../../helper/format";

const getCartPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return res.render("client/product/cart", {
    cartDetails,
    totalPrice,
    formatPrice,
  });
};

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params; // id này là productId
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }

  const quantity =
    req.body.quantity && !isNaN(+req.body.quantity) ? +req.body.quantity : 1;

  try {
    await addProductToCart(quantity, +id, user);
  } catch (error) {
    console.error("Lỗi thêm vào giỏ hàng:", error);
  }

  return res.redirect(req.get("Referrer") || `/product/${id}`);
};

const postDeleteProductInCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (user) {
    await deleteProductInCart(+id);
  } else {
    return res.redirect("/login");
  }

  return res.redirect("/cart");
};

const postCartToCheckout = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const rawIds = req.body.cartDetailIds;
  const rawQtys = req.body.quantities;
  const cartId = req.body.cartId;

  if (!cartId || !rawIds) {
    return res.redirect("/cart");
  }

  // Ép kiểu luôn là mảng (kể cả khi chỉ có 1 sản phẩm gửi lên)
  const cartDetailIds = Array.isArray(rawIds) ? rawIds : [rawIds];
  const quantities = Array.isArray(rawQtys) ? rawQtys : [rawQtys];

  try {
    await updateCartBeforeCheckout(cartId, cartDetailIds, quantities);
    return res.redirect("/checkout");
  } catch (error) {
    console.error("Lỗi cập nhật giỏ hàng trước checkout:", error);
    // Nếu ném lỗi (vượt tồn kho), Transaction đã Rollback -> giữ nguyên ở /cart, không cho sang /checkout
    return res.redirect("/cart");
  }
};

export {
  getCartPage,
  postAddProductToCart,
  postDeleteProductInCart,
  postCartToCheckout,
};
