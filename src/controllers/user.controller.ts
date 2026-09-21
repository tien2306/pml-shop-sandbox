import { Request, Response } from "express";
import {
  getAllUsers,
  getUserById,
  handleCreateUser,
  handleDeleteUser,
  updateUserById,
} from "services/user.service";

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
  //Lấy dữ liệu từ form nhập
  const { name, email, address } = req.body;
  //handle create user
  await handleCreateUser(name, email, address);
  return res.redirect("/"); // chuyển hướng
};

const postDeleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // const { id } = req.params ;
  const id = req.params.id as string;
  await handleDeleteUser(id);
  return res.redirect("/"); // chuyển hướng
};

const getViewUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // const { id } = req.params;
  const id = req.params.id as string;
  //get user by id
  const user = await getUserById(id);
  return res.render("view-user.ejs", {
    id: id,
    user: user,
  });
};

const getUpdateUser = async (req: Request, res: Response) => {
  //Lấy dữ liệu từ form nhập
  const { id, name, email, address } = req.body;
  //handle update user by id
  await updateUserById(id, name, email, address);
  return res.redirect("/"); // chuyển hướng
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  getUpdateUser,
};
