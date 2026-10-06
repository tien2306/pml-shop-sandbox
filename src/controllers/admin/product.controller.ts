import { Request, Response } from "express";
import { ProductSchema, TProductSchema } from "../../validation/product.schema";
import {
  createProduct,
  deleteProductById,
  getProductById,
  updateProductById,
} from "../../services/admin/product.service";

const factoryOptions = [
  { name: "Apple (MacBook)", value: "APPLE" },
  { name: "Asus", value: "ASUS" },
  { name: "Lenovo", value: "LENOVO" },
  { name: "Dell", value: "DELL" },
  { name: "LG", value: "LG" },
  { name: "Acer", value: "ACER" },
];

const targetOptions = [
  { name: "Gaming", value: "GAMING" },
  { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
  { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
  { name: "Mỏng nhẹ", value: "MONG-NHE" },
  { name: "Doanh nhân", value: "DOANH-NHAN" },
];

// C - create product
const getAdminCreatePruductPage = async (req: Request, res: Response) => {
  const errors: object[] = [];
  const oldData = {
    name: "",
    price: "",
    quantity: "",
    detailDesc: "",
    shortDesc: "",
    factory: "",
    target: "",
  };
  return res.render("admin/product/create.ejs", {
    errors,
    oldData,
    factoryOptions,
    targetOptions,
  });
};

const postAdminCreatePruduct = async (req: Request, res: Response) => {
  const { name, price, quantity, detailDesc, shortDesc, factory, target } =
    req.body as TProductSchema;
  const result = ProductSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues;

    const oldData = {
      name,
      price,
      quantity,
      detailDesc,
      shortDesc,
      factory,
      target,
    };

    return res.render("admin/product/create.ejs", {
      errors,
      oldData,
      factoryOptions,
      targetOptions,
    });
  } else {
    // console.log(result.data);
    const file = req.file;
    const image = file?.filename ?? null;

    await createProduct(
      result.data.name,
      result.data.price,
      result.data.quantity,
      result.data.detailDesc,
      result.data.shortDesc,
      result.data.factory,
      result.data.target,
      image,
    );
    return res.redirect("/admin/product");
  }
};

// U - update product

const getAdminViewProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const errors: object[] = [];

  const product = await getProductById(id);
  const oldData = {
    name: product?.name,
    price: product?.price,
    quantity: product?.quantity,
    detailDesc: product?.detailDesc,
    shortDesc: product?.shortDesc,
    factory: product?.factory,
    target: product?.target,
  };

  return res.render("admin/product/edit.ejs", {
    id: id,
    product: product,
    oldData: oldData,
    errors: errors,
    factoryOptions: factoryOptions,
    targetOptions: targetOptions,
  });
};

const postAdminUpdateProduct = async (req: Request, res: Response) => {
  const { id, name, price, quantity, detailDesc, shortDesc, factory, target } =
    req.body as TProductSchema;

  const result = ProductSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues;

    const oldData = {
      name,
      price,
      quantity,
      detailDesc,
      shortDesc,
      factory,
      target,
    };

    // Lấy lại thông tin product cũ để truyền vào view hiển thị ảnh
    const product = await getProductById(String(id));

    return res.render("admin/product/edit.ejs", {
      id,
      errors,
      oldData,
      product,
      factoryOptions,
      targetOptions,
    });
  } else {
    // console.log(result.data);
    const file = req.file;
    const image = file?.filename ?? undefined;

    //handle update product by id
    await updateProductById(
      result.data.id,
      result.data.name,
      result.data.price,
      result.data.quantity,
      result.data.detailDesc,
      result.data.shortDesc,
      result.data.factory,
      result.data.target,
      image,
    );
    return res.redirect("/admin/product");
  }
};

// D - delete product
const postAdminDeleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await deleteProductById(id);
  return res.redirect("/admin/product");
};

export {
  getAdminCreatePruductPage,
  postAdminCreatePruduct,
  postAdminDeleteProduct,
  getAdminViewProduct,
  postAdminUpdateProduct,
};
