import { prisma } from "../../config/database";

const getProducts = async () => {
  return await prisma.product.findMany();
};

const getProductById = async (id: number) => {
  return await prisma.product.findUnique({ where: { id: id } });
};

const addProductToCart = async (
  quantity: number,
  productId: number,
  user: Express.User | undefined,
) => {
  if (!user?.id) {
    throw new Error("Người dùng cần đăng nhập để thực hiện chức năng này.");
  }

  const cart = await prisma.cart.findUnique({ where: { userId: user.id } });
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new Error("Sản phẩm không tồn tại.");
  }

  if (cart) {
    //update
    // cập nhật sum giỏ hàng
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        sum: { increment: quantity },
      },
    });

    // cập nhật cart-detail
    // nếu chưa có, tạo mới. có rồi, cập nhật quantity
    // update + insert (đã tồn tại update, k thì tạo mới)

    const currentCartDetail = await prisma.cartDetail.findFirst({
      where: { productId: productId, cartId: cart.id },
    });

    await prisma.cartDetail.upsert({
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
    //create
    await prisma.cart.create({
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
  // Id chi tiết của 1 giỏ hàng
  // Lấy giỏ hàng đó ra (có quantity, Cart_Id)
  const cartDetail = await prisma.cartDetail.findUnique({
    where: { id: cartDetailId },
  });

  // KT sự tồn tại
  if (!cartDetail) {
    throw new Error("Không tìm thấy sản phẩm trong giỏ hàng");
  }

  // TH có tồn tại
  await prisma.cart.update({
    where: {
      // Tìm đến giỏ hàng cha
      id: cartDetail.cartId,
    },
    data: {
      sum: {
        // Trừ đúng số lượng sản phẩm bị xóa
        decrement: cartDetail.quantity,
      },
      cartDetails: {
        delete: {
          // Xóa bản ghi con trong cartDetail
          id: cartDetail.id,
        },
      },
    },
  });
};

export {
  getProducts,
  getProductById,
  addProductToCart,
  getProductInCart,
  deleteProductInCart,
};
