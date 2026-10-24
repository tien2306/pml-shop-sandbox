import { TOTAL_ITEMS_ORDER_PAGE } from "config/constant";
import { prisma } from "config/database";

const getOrderList = async (userId: number, page: number) => {
  const pageSize = TOTAL_ITEMS_ORDER_PAGE;
  const skip = (page - 1) * pageSize;

  const orderList = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    skip: skip,
    take: pageSize,
  });

  return orderList;
};

const getProductInOrder = async (orderId: number) => {
  return await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderDetails: {
        include: {
          product: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
    },
  });
};

const countTotalOrderPages = async () => {
  const totalItems = await prisma.order.count();
  const limitPage = TOTAL_ITEMS_ORDER_PAGE;

  const totalPages = Math.ceil(totalItems / limitPage);
  return totalPages;
};

export { getOrderList, getProductInOrder, countTotalOrderPages };
