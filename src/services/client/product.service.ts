import { prisma } from "../../config/database";

const getProducts = async () => {
  return await prisma.product.findMany();
};

const getProductById = async (id: number) => {
  return await prisma.product.findUnique({ where: { id: id } });
};

export { getProducts, getProductById };
