import { TOTAL_ITEMS_PRODUCT_PAGE_HOME } from "config/constant";
import { prisma } from "../../config/database";

const getProducts = async (page: number) => {
  const pageSize = TOTAL_ITEMS_PRODUCT_PAGE_HOME;
  const skip = (page - 1) * pageSize;

  return await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
};

const getProductById = async (id: number) => {
  return await prisma.product.findUnique({ where: { id: id } });
};

const countTotalProductPagesHome = async () => {
  const totalItems = await prisma.product.count();
  const limitPage = TOTAL_ITEMS_PRODUCT_PAGE_HOME;

  const totalPages = Math.ceil(totalItems / limitPage);
  return totalPages;
};

export { getProducts, getProductById, countTotalProductPagesHome };
