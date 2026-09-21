// Get the client
import "dotenv/config";
import mysql from "mysql2/promise";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

console.log("--- KIỂM TRA ĐƯỜNG DẪN CHẠY APP: ---", process.cwd());
console.log("--- GIÁ TRỊ USER ĐỌC ĐƯỢC: ---", process.env.DATABASE_USER);

// Create the connection pool.
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT), // default '3306' 3306
  user: process.env.DATABASE_USER, // default password empty
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,

  waitForConnections: true,
  connectionLimit: 10, // giới hạn 10 kết nối
  queueLimit: 0, // hàng chờ đợi phục vụ 0 giới hạn

  //   maxIdle: 5, // số kết nối rãnh rổi tối đa để phụ vụ
  //   idleTimeout: 60000, // sau 60s đóng kết nối, k còn ai phục vụ đóng luôn 5 cái rãnh
  //   enableKeepAlive: true, // giữ kết nối luôn sống, sợ nhà mạng tự ngắt
  //   keepAliveInitialDelay: 0, //
});

const adapter = new PrismaMariaDb(pool as any);
const prisma = new PrismaClient({ adapter });

// Create the connection to database
const getConnection = async () => {
  return await pool.getConnection();
};

export { prisma };
export default getConnection;
