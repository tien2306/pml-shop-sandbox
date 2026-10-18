import { Prisma } from "../generated/prisma/client";

type UserWithRole = Prisma.UserGetPayload<{
  include: { role: true };
  omit: { password: true };
}>;

declare global {
  namespace Express {
    interface User extends UserWithRole {
      sumCart?: number;
    }
  }
}
