import { Request, Response } from "express";
import {
  countTotalProductPagesHome,
  getProducts,
} from "../../services/client/product.service";
import { formatPrice } from "../../helper/format";

const getHomePage = async (req: Request, res: Response) => {
  //get data
  const { page } = req.query;

  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const totalPages: number = await countTotalProductPagesHome();
  const products = await getProducts(currentPage);

  return res.render("client/home/show.ejs", {
    products,
    formatPrice,
    currentPage,
    totalPages,
  });
};

export { getHomePage };
