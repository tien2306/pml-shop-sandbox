import { prisma } from "../../config/database";

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User | undefined,
) => {
  if (!user?.id) {
    throw new Error("Người dùng cần đăng nhập để thực hiện chức năng này.");
  }

  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({ where: { userId: user.id } });
    const product = await tx.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new Error("Sản phẩm không tồn tại.");
    }

    // Kiểm tra tồn kho số lượng người dùng nhập nếu mua vượt quá kho -> ném lỗi để Transaction Rollback
    if (quantity > product.quantity) {
      throw new Error(`Sản phẩm chỉ còn ${product.quantity} cái trong kho!`);
    }

    if (cart) {
      // Lấy đúng giỏ hàng đó
      const currentCartDetail = await tx.cartDetail.findFirst({
        where: { cartId: cart.id, productId: productId },
      });

      // Cũng là kiểm tra tồn kho nhưng mà số lượng trong cartDetail so với kho
      const totalQty = (currentCartDetail?.quantity || 0) + quantity;
      if (totalQty > product.quantity) {
        throw new Error(
          `Bạn đã có ${currentCartDetail?.quantity} cái trong giỏ, kho chỉ còn ${product.quantity} cái!`,
        );
      }

      // Cập nhật lại sum trong cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          sum: { increment: quantity },
        },
      });

      // Cập nhật quantity trong cartDetail
      await tx.cartDetail.upsert({
        where: { id: currentCartDetail?.id ?? 0 },
        update: {
          quantity: { increment: quantity },
        },
        create: {
          price: product.price,
          quantity: quantity,
          productId: productId,
          cartId: cart.id,
        },
      });
    } else {
      await tx.cart.create({
        data: {
          sum: quantity,
          userId: user.id,
          cartDetails: {
            create: [
              {
                price: product.price,
                quantity: quantity,
                productId: productId,
              },
            ],
          },
        },
      });
    }
  });
};

const getProductInCart = async (userId: number) => {
  const cartWithProducts = await prisma.cart.findUnique({
    where: { userId: userId },
    include: {
      cartDetails: {
        include: {
          product: {
            select: {
              image: true,
              name: true,
              id: true,
            },
          },
        },
      },
    },
  });
  return cartWithProducts?.cartDetails ?? [];
};

const deleteProductInCart = async (cartDetailId: number) => {
  const cartDetail = await prisma.cartDetail.findUnique({
    where: { id: cartDetailId },
  });

  if (!cartDetail) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  await prisma.cart.update({
    where: {
      id: cartDetail.cartId,
    },
    data: {
      sum: {
        decrement: cartDetail.quantity,
      },
      cartDetails: {
        delete: {
          id: cartDetail.id,
        },
      },
    },
  });
};

const updateCartBeforeCheckout = async (
  cartId: string | number,
  cartDetailIds: string[],
  quantities: string[],
) => {
  const detailIds = Array.isArray(cartDetailIds)
    ? cartDetailIds
    : [cartDetailIds];
  const qtys = Array.isArray(quantities) ? quantities : [quantities];

  return await prisma.$transaction(async (tx) => {
    // 1. Cập nhật quantity từng sản phẩm
    for (let i = 0; i < detailIds.length; i++) {
      const id = +detailIds[i];
      const qty = +qtys[i];

      const item = await tx.cartDetail.findUnique({
        where: { id },
        include: { product: true },
      });

      if (item) {
        // KIỂM TRA TỒN KHO: Nếu số lượng nhập > tồn kho của sản phẩm -> Ném lỗi -> Transaction tự động Rollback!
        if (qty > item.product.quantity) {
          throw new Error(
            `Sản phẩm "${item.product.name}" trong kho chỉ còn ${item.product.quantity} cái, không thể mua ${qty} cái!`,
          );
        }

        await tx.cartDetail.update({
          where: { id },
          data: { quantity: qty },
        });
      }
    }

    // 2. Tính lại tổng số lượng thực tế trong Cart
    const allDetailsInCart = await tx.cartDetail.findMany({
      where: { cartId: +cartId },
    });

    const totalSum = allDetailsInCart.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    // 3. Cập nhật tổng sum của Cart cha
    await tx.cart.update({
      where: { id: +cartId },
      data: {
        sum: totalSum,
      },
    });
  });
};

export {
  addProductToCart,
  getProductInCart,
  deleteProductInCart,
  updateCartBeforeCheckout,
};
