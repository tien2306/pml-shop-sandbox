import { Request, Response } from "express";
import { getAllUsers } from "services/user.service";

const getHomePage = async (req: Request, res: Response) => {
  //get data
  const users = await getAllUsers();
  // console.log(users);
  return res.render("client/home/show.ejs", { users });
};

export { getHomePage };
