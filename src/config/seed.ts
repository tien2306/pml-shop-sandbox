import { prisma } from "./database";

const initDatabase = async () => {
  const countUser = await prisma.user.count();
  const countRole = await prisma.role.count();

  if (countUser === 0) {
    await prisma.user.createMany({
      data: [
        {
          username: "nguyenvana@gmail.com",
          password: "123456",
          accountType: "SYSTEM",
        },
        {
          username: "nguyenvanb@gmail.com",
          password: "123456",
          accountType: "SYSTEM",
        },
        {
          username: "nguyenvanc@gmail.com",
          password: "123456",
          accountType: "SYSTEM",
        },
      ],
    });
  } else if (countRole === 0) {
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
  } else {
    console.log(">>> Already init data");
  }
};

export default initDatabase;
