import * as z from "zod";

//  price: z.coerce
//   .number({
//     error: (iss) => {
//       if (iss.code === "invalid_type") {
//         return `Sai kiểu dữ liệu, mong đợi là ${iss.expected}`;
//       }
//       if (iss.code === "too_small") {
//         return `Số tiền tối thiểu là ${iss.minimum}`;
//       }
//       // ...
//     },
//   })
//   .min(1),
export const ProductSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().trim().min(1, "Không được để trống"),
  price: z.coerce
    .number("Giá tiền phải là số")
    .min(1, "Số tiền tối thiểu là 1"),
  quantity: z.coerce
    .number("Số lượng phải là số")
    .min(1, "Số lượng phải lớn hơn hoặc bằng 1"),
  detailDesc: z.string().trim().min(1, "Không được để trống"),
  shortDesc: z.string().trim().min(1, "Không được để trống"),

  factory: z.enum(["APPLE", "ASUS", "LENOVO", "DELL", "LG", "ACER"], {
    message: "Vui lòng chọn một hãng sản xuất hợp lệ",
  }),

  target: z.enum(
    [
      "GAMING",
      "SINHVIEN-VANPHONG",
      "THIET-KE-DO-HOA",
      "MONG-NHE",
      "DOANH-NHAN",
    ],
    {
      message: "Nhu cầu sử dụng không hợp lệ",
    },
  ),
});

export type TProductSchema = z.infer<typeof ProductSchema>;
