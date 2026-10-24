import { prisma } from "config/database";

const getProductMinPrice = async (minPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        gte: minPrice,
      },
    },
    orderBy: {
      price: "asc",
    },
  });
};

const getProductMaxPrice = async (maxPrice: number) => {
  return await prisma.product.findMany({
    where: {
      price: {
        lte: maxPrice,
      },
    },
    orderBy: {
      price: "desc",
    },
  });
};

const getProductsByFactory = async (factoryName: string) => {
  return await prisma.product.findMany({
    where: {
      factory: {
        equals: factoryName,
      },
    },
  });
};

const getProductsByFactories = async (factoryQuery: string) => {
  const factoryNames = factoryQuery ? factoryQuery.split(",") : [];

  return await prisma.product.findMany({
    where: {
      factory: {
        in: factoryNames,
      },
    },
  });
};

const getProductsByPriceRanges = async (min: number, max: number) => {
  return await prisma.product.findMany({
    where: {
      AND: [
        {
          price: {
            gte: min,
          },
        },
        {
          price: {
            lte: max,
          },
        },
      ],
    },
  });
};

// Định nghĩa kiểu dữ liệu cho một khoảng giá để code rõ ràng
type PriceBound = { min: number; max: number };

const getProductsByMultiplePriceRanges = async (ranges: PriceBound[]) => {
  return await prisma.product.findMany({
    where: {
      OR: ranges.map((range) => ({
        price: {
          gte: range.min,
          lte: range.max,
        },
      })),
    },
  });
};

const getProductsWithSort = async (
  field: string,
  direction: "asc" | "desc",
) => {
  return await prisma.product.findMany({
    orderBy: {
      [field]: direction, // dấu ngoặc vuông [] giúp truyền tên cột động (ví dụ: 'price')
    },
  });
};

const getProductWithFilter = async (
  page: number,
  limitPage: number,
  factory: string,
  target: string,
  price: string,
  sort: string,
) => {
  //build where query
  let whereClause: any = {};
  let orderByClause: any = {};

  if (factory) {
    const factoryInput = factory.split(",");
    whereClause.factory = {
      in: factoryInput,
    };
  }
  if (target) {
    const targetInput = target.split(",");
    whereClause.target = {
      in: targetInput,
    };
  }

  if (price) {
    const priceInput = price.split(",");
    // ["duoi-10-trieu", "10-15-trieu", "15-20-trieu", "tren-20-trieu"];
    const priceCondition = [];

    for (let i = 0; i < priceInput.length; i++) {
      if (priceInput[i] === "duoi-10-trieu") {
        priceCondition.push({ price: { lt: 10000000 } });
      }
      if (priceInput[i] === "10-15-trieu") {
        priceCondition.push({ price: { gte: 10000000, lte: 15000000 } });
      }
      if (priceInput[i] === "15-20-trieu") {
        priceCondition.push({ price: { gte: 15000000, lte: 20000000 } });
      }
      if (priceInput[i] === "tren-20-trieu") {
        priceCondition.push({ price: { gt: 20000000 } });
      }
    }

    whereClause.OR = priceCondition;
  }

  if (sort) {
    if (sort === "gia-tang-dan") {
      orderByClause = { price: "asc" };
    }
    if (sort === "gia-giam-dan") {
      orderByClause = { price: "desc" };
    }
  }

  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      skip: (page - 1) * limitPage,
      take: limitPage,
      where: whereClause,
      orderBy: orderByClause,
    }),
    prisma.product.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(count / limitPage);

  return {
    products,
    totalPages,
  };
};

export {
  getProductMinPrice,
  getProductMaxPrice,
  getProductsByFactory,
  getProductsByFactories,
  getProductsByPriceRanges,
  getProductsByMultiplePriceRanges,
  getProductsWithSort,
  getProductWithFilter,
};
