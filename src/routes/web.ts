import express, { Express } from "express"; //const express = require('express)
const router = express.Router();
import fileUploadMiddleware from "../middleware/multer";
import { getHomePage } from "controllers/client/home.controller";
import { getDetailProductPage } from "controllers/client/product.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashborad.controller";
import {
  getAdminCreateUserPage,
  postAdminCreateUser,
  postAdminDeleteUser,
  getAdminViewUser,
  postAdminUpdateUser,
} from "controllers/admin/user.controller";
import {
  getAdminCreatePruductPage,
  postAdminCreatePruduct,
} from "controllers/admin/product.controller";

const webRoutes = (app: Express) => {
  //client routes
  router.get("/", getHomePage);
  router.get("/product/:id", getDetailProductPage);

  //admin routes
  // User
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);

  router.get("/admin/create-user", getAdminCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar"),
    postAdminCreateUser,
  );

  router.post("/admin/delete-user/:id", postAdminDeleteUser);

  router.get("/admin/view-user/:id", getAdminViewUser);
  router.post(
    "/admin/handle-update-user",
    fileUploadMiddleware("avatar"),
    postAdminUpdateUser,
  );

  // Product
  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/create-product", getAdminCreatePruductPage);
  router.post(
    "/admin/handle-create-product",
    fileUploadMiddleware("image", "images/product"),
    postAdminCreatePruduct,
  );

  // Order
  router.get("/admin/order", getAdminOrderPage);

  // khai báo route
  app.use("/", router);
};

export default webRoutes;
