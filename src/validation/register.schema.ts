import { isEmailExist } from "../services/auth/auth.service";
import { z } from "zod";
import { User } from "../generated/prisma/client";

const passwordSchema = z
  .string()
  .min(3, "Mật khẩu phải có ít nhất 3 ký tự")
  .max(20, "Mật khẩu tối đa 20 ký tự");
//   .refine((val) => /[A-Z]/.test(val), {
//     error: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa",
//   })
//   .refine((val) => /[a-z]/.test(val), {
//     error: "Mật khẩu phải chứa ít nhất một chữ cái viết thường",
//   })
//   .refine((val) => /[0-9]/.test(val), {
//     error: "Mật khẩu phải chứa ít nhất một chữ số",
//   })
//   .refine((val) => /[!@#$%^&*]/.test(val), {
//     error: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
//   });

export const RegisterSchema = z
  .object({
    fullName: z.string().trim().min(1, "Tên không được để trống"),
    email: z.email("Email không đúng định dạng"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Vui lòng xác nhận lại mật khẩu"),
  })
  .refine(
    async (data) => {
      const existingUser: boolean = await isEmailExist(data.email);
      return !existingUser;
    },
    {
      error: "Email này đã được sử dụng rồi",
      path: ["email"],
    },
  )
  .refine((data) => data.password === data.confirmPassword, {
    error: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type TRegisterSchema = z.infer<typeof RegisterSchema>;
