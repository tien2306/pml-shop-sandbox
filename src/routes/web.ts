import express, { Express } from "express"; //const express = require('express)
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
} from "controllers/user.controller";

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/create-user", getCreateUserPage);
  router.post("/handle-create-user", postCreateUser);

  router.post("/handle-delete-user/:id", postDeleteUser);

  // khai báo route
  app.use("/", router);
};

export default webRoutes;
