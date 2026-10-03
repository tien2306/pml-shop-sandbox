import { Request, Response } from "express";
import { getAllUsers } from "services/admin/user.service";

const getDetailProductPage = async (req: Request, res: Response) => {
  //get data
  const users = await getAllUsers();
  // console.log(users);
  return res.render("client/product/detail.ejs", { users });
};

export { getDetailProductPage };
