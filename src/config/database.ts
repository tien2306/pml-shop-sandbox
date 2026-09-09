// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    port: 3306,
    database: "nodejs",
  });

  return connection;
};

export default getConnection;
