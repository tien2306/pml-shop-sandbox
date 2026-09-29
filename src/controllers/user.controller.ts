import { Request, Response } from "express";
import {
  getAllRoles,
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

//admin
// C - create user
const getCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  return res.render("admin/user/create.ejs", { roles });
};

const postCreateUser = async (req: Request, res: Response) => {
  //Lấy dữ liệu từ form nhập
  const { fullName, username, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? null;
  //handle create user
  await handleCreateUser(
    fullName,
    username,
    address,
    phone,
    avatar as string,
    role,
  );
  return res.redirect("/admin/user"); // chuyển hướng
};

// U - update user
const getViewUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // const { id } = req.params;
  const id = req.params.id as string;
  //get user by id
  const user = await getUserById(id);
  const roles = await getAllRoles();

  return res.render("admin/user/detail.ejs", {
    id: id,
    user: user,
    roles: roles,
  });
};

const postUpdateUser = async (req: Request, res: Response) => {
  //Lấy dữ liệu từ form nhập
  const { id, fullName, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? undefined;
  //handle update user by id
  await updateUserById(id, fullName, phone, role, address, avatar as string);
  return res.redirect("/admin/user"); // chuyển hướng
};

// D - delete user
const postDeleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // const { id } = req.params ;
  const id = req.params.id as string;
  await handleDeleteUser(id);
  return res.redirect("/admin/user"); // chuyển hướng
};

export {
  getHomePage,
  getCreateUserPage,
  postCreateUser,
  postDeleteUser,
  getViewUser,
  postUpdateUser,
};
