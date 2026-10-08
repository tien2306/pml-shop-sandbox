import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../config/database";
import { comparePassword } from "../services/auth/bcrypt.service";
import { getUserById } from "services/admin/user.service";
// import { User } from "@prisma/client";

const configPassportLocal = () => {
  passport.use(
    new LocalStrategy(
      {
        // usernameField: "email",
        passReqToCallback: true,
      },
      async function verify(req, username, password, callback) {
        try {
          const session = req.session as any;
          if (session && session.messages) {
            session.messages = [];
          }

          // check user exist in database
          const user = await prisma.user.findUnique({
            where: { username: username },
          });

          if (!user) {
            return callback(null, false, {
              message: `Username/password invalid`,
            });
          }

          // compare password
          const isMatch = await comparePassword(password, user.password);
          if (!isMatch) {
            return callback(null, false, {
              message: `Username/password invalid`,
            });
          }

          return callback(null, user);
        } catch (error) {
          // Nếu DB lỗi (timeout, mất kết nối...), chuyển lỗi về cho Express xử lý thay vì crash app
          return callback(error);
        }
      },
    ),
  );

  // serializeUser: Mã hóa thôn tin nhận đc và Lưu vào Session
  // trả về session id cho cookie người dùng
  passport.serializeUser(function (user: any, cb) {
    cb(null, { id: user.id, username: user.username });
  });

  // Client khi có req nào đó nó sẽ gửi kèm cookie lên trong đó có session id
  // thư viện kt(giải mã) cái đối tượng Session id đó nếu trong database Session có thì mới trả về cái user trong session
  // Từ cái user trong session đó query lấy thống tin người dùng đó gán vào -> `req.user`
  passport.deserializeUser(async function (user: any, cb) {
    const { id, username } = user;
    // query to database '
    const userInDB = await getUserById(id);
    return cb(null, { ...userInDB });
  });
};

export default configPassportLocal;
