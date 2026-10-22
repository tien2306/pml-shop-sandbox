import { z } from "zod";

// Regex kiểm tra số điện thoại Việt Nam (bắt đầu bằng 0 hoặc +84, theo sau là các đầu số 3, 5, 7, 8, 9 và 8 chữ số)
const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;

export const CheckoutSchema = z.object({
  receiverName: z.string().trim().min(1, "Tên người nhận không được để trống"),

  receiverAddress: z
    .string()
    .trim()
    .min(5, "Địa chỉ nhận hàng tối thiểu 5 ký tự"),

  receiverPhone: z
    .string()
    .trim()
    .regex(
      phoneRegex,
      "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)",
    ),
});

export type TCheckoutSchema = z.infer<typeof CheckoutSchema>;
