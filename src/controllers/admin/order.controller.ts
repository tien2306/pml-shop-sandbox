import { Request, Response } from "express";
import { getProductInOrder } from "services/admin/order.service";

const getAdminOrderDetailPage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orders = await getProductInOrder(+id);
  return res.render("admin/order/view.ejs", { order: orders, orders });
};

export { getAdminOrderDetailPage };
