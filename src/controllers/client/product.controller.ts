import { Request, Response } from "express";
import {
  addProductToCart,
  deleteProductInCart,
  getProductById,
  getProductInCart,
} from "../../services/client/product.service";
import { formatPrice } from "../../helper/format";
import { prisma } from "config/database";

const getProductPageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);

  return res.render("client/product/detail.ejs", { product, formatPrice });
};

const postAddProductToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  if (user) {
    await addProductToCart(1, +id, user);
  } else {
    return res.redirect("/login");
  }

  return res.redirect("/");
};

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

const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { sumCart } = user;

  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return res.render("client/product/checkout", {
    cartDetails,
    totalPrice,
    formatPrice,
    sumCart,
  });
};

export {
  getProductPageById,
  postAddProductToCart,
  getCartPage,
  postDeleteProductInCart,
  getCheckOutPage,
};
