import multer from "multer"; // import multer mới dùng được req.file
import path from "path"; // cào express đã có sẵn
import { v4 } from "uuid"; // cài uuid để sinh id ngẫu nhiên

const fileUploadMiddleware = (fieldName: string, dir: string = "images") => {
  // Trên Vercel môi trường là read-only, chỉ ghi được vào thư mục /tmp
  const uploadDest = process.env.VERCEL ? "/tmp" : "public/" + dir;

  return multer({
    storage: multer.diskStorage({
      destination: uploadDest, // Nơi lưu file
      filename: (req, file, cb) => {
        const extension = path.extname(file.originalname); // Lấy đuôi file (ví dụ: .jpg)
        cb(null, v4() + extension); // Đổi tên file thành chuỗi ngẫu nhiên + đuôi file
      },
    }),
    limits: {
      fileSize: 1024 * 1024 * 3, //3MB
    },
    fileFilter: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: Function,
    ) => {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true); // Chấp nhận file
      } else {
        cb(new Error("Only JPEG and PNG images are allowed."), false);
      }
    },
  }).single(fieldName); // tên trường DL từ ô input
};

export default fileUploadMiddleware;
