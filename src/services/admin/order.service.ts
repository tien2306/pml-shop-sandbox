import { prisma } from "config/database";

const getOrderList = async (userId: number) => {
  const OrderList = await prisma.order.findFirst({
    where: {
      userId: userId,
    },
  });

  return OrderList ?? [];
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

export { getOrderList, getProductInOrder };
