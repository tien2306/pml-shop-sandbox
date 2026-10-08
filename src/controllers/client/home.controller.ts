import { Request, Response } from "express";
import { getProducts } from "../../services/client/product.service";
import { formatPrice } from "../../helper/format";

const getHomePage = async (req: Request, res: Response) => {
  //get data
  const products = await getProducts();
  const user = req.user;

  return res.render("client/home/show.ejs", { products, formatPrice });
};

export { getHomePage };
