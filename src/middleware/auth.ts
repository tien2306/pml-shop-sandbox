import { Request, Response, NextFunction } from "express";

const isLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/login") || req.path.startsWith("/register")) {
    const isAuthenticated = req.isAuthenticated();

    if (isAuthenticated) {
      return res.redirect("/");
    }
  }

  // Nếu không phải /login hay /register (hoặc chưa đăng nhập), cho đi tiếp!
  return next();
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  // apply only to admin
  if (req.path.startsWith("/admin")) {
    const user = req.user;
    if (user?.role?.name === "ADMIN") {
      return next();
    } else {
      return res.render("status/403.ejs");
    }
  }

  // client routes
  next();
};

export { isLogin, isAdmin };
