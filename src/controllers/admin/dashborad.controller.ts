import { Request, Response } from "express";
import {
  countTotalProductPages,
  getProductList,
} from "../../services/admin/product.service";
import {
  countTotalUserPages,
  getAllUsers,
} from "../../services/admin/user.service";
import {
  countTotalOrderPages,
  getOrderList,
} from "services/admin/order.service";
import { getDashboardInfo } from "services/admin/dashboard.service";

const getDashboardPage = async (req: Request, res: Response) => {
  const info = await getDashboardInfo();

  return res.render("admin/dashboard/show.ejs", { info });
};

const getAdminUserPage = async (req: Request, res: Response) => {
  const { page } = req.query;

  let currentPage: number = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const users = await getAllUsers(currentPage);
  const totalPages: number = await countTotalUserPages();

  return res.render("admin/user/show.ejs", { users, totalPages, currentPage });
};

const getAdminProductPage = async (req: Request, res: Response) => {
  const { page } = req.query;

  let currentPage: number = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const products = await getProductList(currentPage);
  const totalPages: number = await countTotalProductPages();

  return res.render("admin/product/show.ejs", {
    products,
    totalPages,
    currentPage,
  });
};

const getAdminOrderPage = async (req: Request, res: Response) => {
  const { page } = req.query;

  let currentPage: number = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const totalPages: number = await countTotalOrderPages();
  const user = req.user as Express.User;
  const orders = await getOrderList(user.id, currentPage);

  return res.render("admin/order/show.ejs", {
    orders,
    currentPage,
    totalPages,
  });
};

export {
  getDashboardPage,
  getAdminUserPage,
  getAdminProductPage,
  getAdminOrderPage,
};
