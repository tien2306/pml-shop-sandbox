import { hashPassword } from "services/user.service";
import { prisma } from "config/database";
import { ACCOUNT_TYPE } from "config/constant";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();

  if (countRole === 0) {
    await prisma.role.createMany({
      data: [
        {
          name: "ADMIN",
          description: "Admin thì full quyền",
        },
        {
          name: "USER",
          description: "User thông thường",
        },
      ],
    });
  }

  if (countUser === 0) {
    const defaultPassword = await hashPassword("123456");
    const adminRole = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });

    if (adminRole)
      await prisma.user.createMany({
        data: [
          {
            fullName: "nguyen van a",
            username: "nguyenvana@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            address: "",
            avatar: null,
            phone: "",
            roleId: adminRole.id,
          },
          {
            fullName: "nguyen van b",
            username: "nguyenvanb@gmail.com",
            password: defaultPassword,
            accountType: ACCOUNT_TYPE.SYSTEM,
            address: "",
            avatar: null,
            phone: "",
            roleId: adminRole.id,
          },
        ],
      });
  }

  if (countUser !== 0 && countRole !== 0) {
    console.log(">>> Already init data");
  }
};

export default initDatabase;
