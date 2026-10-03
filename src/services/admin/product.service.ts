import { prisma } from "config/database";

const createProduct = async (
  name: string,
  price: number,
  quantity: number,
  detailDesc: string,
  shortDesc: string,
  factory: string,
  target: string,
  image: string | null | undefined,
) => {
  const newUser = await prisma.product.create({
    data: {
      name,
      price,
      quantity,
      detailDesc,
      shortDesc,
      factory,
      target,
      ...(image !== undefined && { image: image }),
    },
  });

  return newUser;
};

const getProductList = async () => {
  return await prisma.product.findMany();
};

const deleteProductById = async (id: string) => {
  await prisma.product.delete({ where: { id: +id } });
};

const getProductById = async (id: string) => {
  const user = await prisma.product.findUnique({ where: { id: +id } });
  return user;
};

const updateProductById = async (
  id: number | undefined,
  name: string,
  price: number,
  quantity: number,
  detailDesc: string,
  shortDesc: string,
  factory: string,
  target: string,
  image: string | null | undefined,
) => {
  const updatedProduct = await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      name,
      price: +price,
      quantity: +quantity,
      detailDesc,
      shortDesc,
      factory,
      target,
      ...(image !== undefined && { image: image }),
    },
  });

  return updatedProduct;
};

export {
  createProduct,
  getProductList,
  deleteProductById,
  getProductById,
  updateProductById,
};
