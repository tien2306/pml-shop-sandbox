import { Request, Response } from "express";
import { getAllUsers, handleCreateUser } from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  //get data
  const users = await getAllUsers();
  // console.log(users);
  return res.render("home.ejs", { users });
};

const getCreateUserPage = (req: Request, res: Response) => {
  return res.render("create.user.ejs");
};

const postCreateUser = async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { name, email, address } = req.body;
  //handle create user
  await handleCreateUser(name, email, address);
  return res.redirect("/"); // chuyển hướng
};

export { getHomePage, getCreateUserPage, postCreateUser };
