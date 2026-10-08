import { Request, Response } from "express";
import {
  RegisterSchema,
  TRegisterSchema,
} from "../../validation/register.schema";
import { registerNewUser } from "../../services/auth/auth.service";

const getLoginPage = async (req: Request, res: Response) => {
  const session = req.session as any;
  const messages = session?.messages ?? [];

  return res.render("client/auth/login.ejs", { messages });
};

const getRegisterPage = async (req: Request, res: Response) => {
  const errors: object[] = [];
  const oldData = {};

  return res.render("client/auth/register.ejs", { errors, oldData });
};

const postRegister = async (req: Request, res: Response) => {
  const { fullName, email, password, confirmPassword } =
    req.body as TRegisterSchema;

  const validate = await RegisterSchema.safeParseAsync(req.body);
  if (!validate.success) {
    const errors = validate.error.issues;
    const oldData = {
      fullName,
      email,
      password,
      confirmPassword,
    };

    return res.render("client/auth/register.ejs", {
      errors,
      oldData,
    });
  } else {
    // console.log(validate.data);
    //handle register
    await registerNewUser(
      validate.data.fullName,
      validate.data.email,
      validate.data.password,
    );
    return res.redirect("/login");
  }
};

export { getLoginPage, getRegisterPage, postRegister };
