import { Request, Response } from "express";
import { getProductById } from "services/client/product.service";
import { formatPrice } from "helper/format";

const getProductPageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await getProductById(+id);

  return res.render("client/product/detail.ejs", { product, formatPrice });
};

export { getProductPageById };
