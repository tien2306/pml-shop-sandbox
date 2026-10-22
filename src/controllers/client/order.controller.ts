import { Request, Response } from "express";
import {
  getProductInAllOrder,
  handlePlaceOrder,
} from "../../services/client/order.service";
import { getProductInCart } from "../../services/client/cart.service";
import { formatPrice } from "../../helper/format";
import {
  CheckoutSchema,
  TCheckoutSchema,
} from "../../validation/checkout.schema";

const getCheckOutPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { sumCart } = user;

  const oldData = {
    receiverName: user.fullName ?? "",
    receiverAddress: user.address ?? "",
    receiverPhone: user.phone ?? "",
  };
  const errors: object[] = [];
  const cartDetails = await getProductInCart(+user.id);

  const totalPrice = cartDetails.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  return res.render("client/product/checkout", {
    cartDetails,
    totalPrice,
    formatPrice,
    sumCart,
    oldData,
    errors,
  });
};

const postPlaceOrder = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  const { sumCart } = user;
  const { receiverName, receiverAddress, receiverPhone } =
    req.body as TCheckoutSchema;

  const validateResult = CheckoutSchema.safeParse(req.body);
  if (!validateResult.success) {
    const errors = validateResult.error.issues;
    const oldData = {
      receiverName,
      receiverAddress,
      receiverPhone,
    };
    const cartDetails = await getProductInCart(+user.id);

    const totalPrice = cartDetails.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    return res.render("client/product/checkout.ejs", {
      oldData,
      cartDetails,
      errors,
      totalPrice,
      formatPrice,
      sumCart,
    });
  } else {
    await handlePlaceOrder(
      +user.id,
      validateResult.data.receiverName,
      validateResult.data.receiverAddress,
      validateResult.data.receiverPhone,
    );
    return res.redirect("/thanks");
  }
};

const getThanksPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");
  return res.render("client/product/thanks");
};

const getOrderHistoryPage = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) return res.redirect("/login");

  const orders = await getProductInAllOrder(+user.id);

  return res.render("client/product/history", { orders });
};

export { getCheckOutPage, postPlaceOrder, getThanksPage, getOrderHistoryPage };
