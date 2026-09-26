import express, { Express } from "express"; //const express = require('express)
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  getUpdateUser,
} from "controllers/user.controller";
import {
  getAdminOrderPage,
  getAdminProductPage,
  getAdminUserPage,
  getDashboardPage,
} from "controllers/admin/dashborad.controller";
import fileUploadMiddleware from "../middleware/multer";

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);

  router.get("/handle-view-user/:id", getViewUser);
  router.post("/handle-update-user", getUpdateUser);
  router.post("/handle-delete-user/:id", postDeleteUser);

  //admin routes
  router.get("/admin", getDashboardPage);
  router.get("/admin/user", getAdminUserPage);
  router.get("/admin/create-user", getCreateUserPage);
  router.post(
    "/admin/handle-create-user",
    fileUploadMiddleware("avatar"),
    postCreateUser,
  );

  router.get("/admin/product", getAdminProductPage);
  router.get("/admin/order", getAdminOrderPage);

  // khai báo route
  app.use("/", router);
};

export default webRoutes;
