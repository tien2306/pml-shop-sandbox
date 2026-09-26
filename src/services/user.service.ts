import { ACCOUNT_TYPE } from "config/constant";
import { prisma } from "config/database";

const handleCreateUser = async (
  fullname: string,
  email: string,
  address: string,
  phone: string,
  avatar: string,
) => {
  const newUser = await prisma.user.create({
    data: {
      fullName: fullname,
      username: email,
      address: address,
      password: "123456",
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar: avatar,
      phone: phone,
    },
  });

  return newUser;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const getAllRoles = async () => {
  const roles = await prisma.role.findMany();
  return roles;
};

const handleDeleteUser = async (id: string) => {
  await prisma.user.delete({ where: { id: +id } });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id: +id } });
  return user;
};

const updateUserById = async (
  id: string,
  name: string,
  email: string,
  address: string,
) => {
  const updatedUser = await prisma.user.update({
    where: {
      // id: Number(id),
      id: +id, // "1" -> 1
    },
    data: {
      fullName: name,
      username: email,
      address: address,
      accountType: "",
    },
  });

  return updatedUser;
};

export {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  getUserById,
  updateUserById,
  getAllRoles,
};
