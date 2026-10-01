import { getAllUsers } from "services/user.service";
import { Request, Response } from "express";

const getAdminCreatePruductPage = async (req: Request, res: Response) => {
  //get data
  const users = await getAllUsers();
  // console.log(users);
  return res.render("admin/product/create.ejs", { users });
};

const postAdminCreatePruduct = async (req: Request, res: Response) => {
  return res.redirect("/admin/product");
};

export { getAdminCreatePruductPage, postAdminCreatePruduct };
