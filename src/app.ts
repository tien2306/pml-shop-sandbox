import "dotenv/config"; // require("dotenv").config();
import express, { Request, Response } from "express"; //const epress = require("express")
import path from "path"; // const path = require("path");
import webRoutes from "./routes/web";
import initDatabase from "./config/seed";
import passport from "passport";
import configPassportLocal from "./middleware/passport.local";
import session from "express-session";
import { prisma } from "config/database";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

// bước chuẩn bị
const app = express();
const PORT = process.env.PORT || 8000;

//config view agine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// config req.body
app.use(express.urlencoded({ extended: true })); // parse dữ liệu form (name=Tien&age=20) -> object JS
app.use(express.json()); // parse JSON raw -> object javascript

//config static file: image/css/js
app.use(express.static("public"));

//config session
// khi chạy middleware này nó sẽ tạo ra req.session
app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    },
    // độ mạnh của chuỗi mã hóa
    secret: "a santa at nasa",

    // có lưu đè session vào store khi k có sự thay đổi ?
    resave: false,

    //Tự động lưu một session trống (chưa có dữ liệu gì) vào store
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      // dọn cookie nếu hết hạn và dọn sau 1 ngày
      checkPeriod: 1 * 24 * 60 * 60 * 1000,

      // xem id như là sessionid
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

//config passport
app.use(passport.initialize());

// Đây chính là dòng code vận hành hàm deserializeUser của bạn. Mỗi khi client gửi request kèm Cookie (sid) lên,
// dòng này sẽ tự động chạy, kiểm tra xem sid có hợp lệ không. Nếu hợp lệ, nó lấy dữ liệu từ PrismaSessionStore,
// truyền qua hàm deserializeUser của bạn để query DB và tự tạo ra object req.user.
app.use(passport.authenticate("session"));

//config passport-local
// cấu hình ntn? khai báo cho passport biết dùng chiến lược xác thực đăng nhập nào
configPassportLocal();

//config route
webRoutes(app);

//seeding data
initDatabase();

//handle not found 404
app.use((req: Request, res: Response) => {
  res.send("404 not found");
});

// bước chạy server
app.listen(PORT, () => {
  console.log(`My app is running on port ${PORT}, ${__dirname}`);
});
