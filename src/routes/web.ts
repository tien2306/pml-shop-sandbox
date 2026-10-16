import express, { Express } from "express"; //const express = require('express)
const router = express.Router();
import fileUploadMiddleware from "../middleware/multer";
import { getHomePage } from "../controllers/client/home.controller";
import { getProductPageById } from "../controllers/client/product.controller";
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
  getAdminViewProduct,
  postAdminCreatePruduct,
  postAdminDeleteProduct,
  postAdminUpdateProduct,
} from "controllers/admin/product.controller";
import {
  getLoginPage,
  getRegisterPage,
  getSuccessRegirectPage,
  postLogout,
  postRegister,
} from "controllers/client/auth.controller";
import passport from "passport";
import { isAdmin, isLogin } from "middlware/auth";

const webRoutes = (app: Express) => {
  //client routes
  router.get("/", getHomePage);
  router.get("/success-redirect", getSuccessRegirectPage);
  router.get("/product/:id", getProductPageById);
  router.get("/login", getLoginPage);
  router.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/success-redirect",
      failureRedirect: "/login",
      failureMessage: true,
    }),
  );
  router.post("/logout", postLogout);
  router.get("/register", getRegisterPage);
  router.post("/register", postRegister);

  //admin routes
  // User
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getAdminCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar", "images/user"),
    postAdminCreateUser,
  );
  router.post("/admin/delete-user/:id", postAdminDeleteUser);
  router.get("/admin/view-user/:id", getAdminViewUser);
  router.post(
    "/admin/handle-update-user",
    fileUploadMiddleware("avatar", "images/user"),
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
  router.post("/admin/delete-product/:id", postAdminDeleteProduct);
  router.get("/admin/view-product/:id", getAdminViewProduct);
  router.post(
    "/admin/handle-update-product",
    fileUploadMiddleware("image", "images/product"),
    postAdminUpdateProduct,
  );

  // Order
  router.get("/admin/order", getAdminOrderPage);

  // khai bao route
  app.use("/", isLogin, isAdmin, router);
};

export default webRoutes;
