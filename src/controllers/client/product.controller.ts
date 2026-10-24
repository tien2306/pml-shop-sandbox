import { Request, Response } from "express";
import { getProductById } from "../../services/client/product.service";
import { formatPrice } from "../../helper/format";
import { TOTAL_ITEMS_PRODUCT_PAGE_HOME } from "config/constant";
import { getProductWithFilter } from "services/client/product.filter";

const getProductPageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);

  return res.render("client/product/detail.ejs", { product, formatPrice });
};

const getProductFilterPage = async (req: Request, res: Response) => {
  //get data
  const {
    page,
    factory = "",
    target = "",
    price = "",
    sort = "",
  } = req.query as {
    page?: string;
    factory: string;
    target: string;
    price: string;
    sort: string;
  };

  // default page = 1
  let currentPage = page ? +page : 1;
  if (currentPage <= 0) currentPage = 1;

  const data = await getProductWithFilter(
    currentPage,
    TOTAL_ITEMS_PRODUCT_PAGE_HOME, //value 9
    factory,
    target,
    price,
    sort,
  );

  return res.render("client/product/filter.ejs", {
    products: data.products,
    formatPrice,
    currentPage,
    totalPages: +data.totalPages,
  });
};

export { getProductPageById, getProductFilterPage };
