import bcrypt from "bcrypt";
const saltRounds = 10;

const hashPassword = async (plainText: string) => {
  return await bcrypt.hash(plainText, saltRounds);
};

const comparePassword = async (plainText: string, hashPassword: string) => {
  return await bcrypt.compare(plainText, hashPassword);
};

export { hashPassword, comparePassword };
