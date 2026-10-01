import { Request, Response } from "express";
import {
  getAllRoles,
  getUserById,
  handleCreateUser,
  handleDeleteUser,
  updateUserById,
} from "services/user.service";

// C - create user
const getAdminCreateUserPage = async (req: Request, res: Response) => {
  const roles = await getAllRoles();
  return res.render("admin/user/create.ejs", { roles });
};

const postAdminCreateUser = async (req: Request, res: Response) => {
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
const getAdminViewUser = async (req: Request, res: Response) => {
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

const postAdminUpdateUser = async (req: Request, res: Response) => {
  //Lấy dữ liệu từ form nhập
  const { id, fullName, phone, role, address } = req.body;
  const file = req.file;
  const avatar = file?.filename ?? undefined;
  //handle update user by id
  await updateUserById(id, fullName, phone, role, address, avatar as string);
  return res.redirect("/admin/user"); // chuyển hướng
};

// D - delete user
const postAdminDeleteUser = async (req: Request, res: Response) => {
  // console.log(req.params.id);
  // const { id } = req.params ;
  const id = req.params.id as string;
  await handleDeleteUser(id);
  return res.redirect("/admin/user"); // chuyển hướng
};

export {
  getAdminCreateUserPage,
  postAdminCreateUser,
  postAdminDeleteUser,
  getAdminViewUser,
  postAdminUpdateUser,
};
