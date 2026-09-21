import getConnection from "config/database";

const handleCreateUser = async (
  name: string,
  email: string,
  address: string,
) => {
  //inser into database
  const connection = await getConnection();

  // A simple SELECT query
  try {
    const sql =
      "INSERT INTO `users`(`name`, `email`, `address`) VALUES (?, ?, ?)";
    const values = [name, email, address];
    const [result, fields] = await connection.execute(sql, values);
    console.log("thêm mới thành công");
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllUsers = async () => {
  const connection = await getConnection();
  // A simple SELECT query
  try {
    const [results, fields] = await connection.query("SELECT * FROM `users` ");
    return results;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const handleDeleteUser = async (id: string) => {
  //inser into database
  const connection = await getConnection();

  // A simple SELECT query
  try {
    const sql = "DELETE FROM `users` WHERE `id` = ? LIMIT 1";
    const values = [id];
    const [result, fields] = await connection.query(sql, values);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getUserById = async (id: string) => {
  //inser into database
  const connection = await getConnection();

  // A simple SELECT query
  try {
    const sql = "SELECT * FROM `users` WHERE `id` = ?";
    const values = [id];
    const [result, fields] = await connection.query(sql, values);
    const rouws = result as any[];

    if (rouws.length > 0) {
      return rouws[0];
    }

    return null;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const updateUserById = async (
  id: string,
  name: string,
  email: string,
  address: string,
) => {
  //inser into database
  const connection = await getConnection();

  // A simple SELECT query
  try {
    const sql =
      "UPDATE `users` SET `name` = ?, `email` = ?, `address` = ? WHERE `id` = ?";
    const values = [name, email, address, id];

    const [result, fields] = await connection.execute(sql, values);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export {
  handleCreateUser,
  getAllUsers,
  handleDeleteUser,
  getUserById,
  updateUserById,
};
