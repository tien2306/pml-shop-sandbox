import { prisma } from "../../config/database";

const handlePlaceOrder = async (
  userId: number,
  receiverName: string,
  receiverAddress: string,
  receiverPhone: string,
) => {
  // Bọc toàn bộ quy trình đặt hàng vào Transaction
  return await prisma.$transaction(async (tx) => {
    // 1. Lấy thông tin giỏ hàng và danh sách sản phẩm trong giỏ của user
    const cart = await tx.cart.findUnique({
      where: { userId: userId },
      include: {
        cartDetails: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.cartDetails.length === 0) {
      throw new Error("Giỏ hàng của bạn đang trống!");
    }

    // 2. Kiểm tra tồn kho trước khi đặt hàng (Nếu thiếu hàng -> throw Error để tự động Rollback)
    for (const item of cart.cartDetails) {
      if (item.product.quantity < item.quantity) {
        throw new Error(
          `Sản phẩm "${item.product.name}" trong kho chỉ còn ${item.product.quantity}, không đủ số lượng bạn đặt (${item.quantity})!`,
        );
      }
    }

    // 3. Tính tổng tiền đơn hàng
    const totalPrice = cart.cartDetails.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // 4. Tạo Order lồng luôn OrderDetail (Nested Create)
    const newOrder = await tx.order.create({
      data: {
        totalPricee: totalPrice,
        paymentMethod: "COD",
        paymentStatus: "PAYMENT_UNPAID",

        receiverName: receiverName,
        receiverAddress: receiverAddress,
        receiverPhone: receiverPhone,

        status: "PENDING",
        userId: userId,

        orderDetails: {
          create: cart.cartDetails.map((item) => ({
            productId: item.productId,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    // 5. Giảm số lượng tồn kho (quantity) và tăng số lượng đã bán (sold) trong bảng Product
    for (let i = 0; i < cart.cartDetails.length; i++) {
      const item = cart.cartDetails[i];
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
    }

    // 6. Xóa sạch các món trong giỏ hàng (CartDetail) và reset sum về 0
    await tx.cartDetail.deleteMany({
      where: { cartId: cart.id },
    });

    await tx.cart.update({
      where: { id: cart.id },
      data: { sum: 0 },
    });

    return newOrder;
  });
};

const getProductInAllOrder = async (userId?: number) => {
  return await prisma.order.findMany({
    where: userId ? { userId: userId } : undefined,
    include: {
      orderDetails: {
        include: {
          product: {
            select: {
              id: true,
              image: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });
};

export { handlePlaceOrder, getProductInAllOrder };
