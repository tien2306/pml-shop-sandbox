import express, { Express } from "express"; //const express = require('express)
const router = express.Router();
import {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
} from "../controllers/user.controller";

const webRoutes = (app: Express) => {
  router.get("/", getHomePage);
  router.get("/create-user", getCreateUserPage);
  router.post("/create-user", postCreateUser);

  // khai báo route
  app.use("/", router);
};

export default webRoutes;
