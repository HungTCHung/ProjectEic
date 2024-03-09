import db from "../models/index";
import bcrypt, { hash } from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};

const createNewUser = async (email, password, username) => {
  let hashPass = hashUserPassword(password);
  try {
    await db.User.create({
      username: username,
      email: email,
      password: hashPass,
    });
  } catch (e) {
    console.log(">>>check error", error);
  }
};

const getUserList = async () => {
  let newUser = await db.User.findOne({
    where: { id: 1 },
    attributes: ["id", "username", "email"],
    include: {
      model: db.Group,
      attributes: ["name", "description"],
      raw: true,
      nest: true,
    },
  });
  let r = await db.Role.findAll({
    include: { model: db.Group, where: { id: 1 } },
    raw: true,
    nest: true,
  });
  console.log(">>check new users", newUser);
  console.log(">>> check new g", r);
  try {
    let users = [];
    users = await db.User.findAll({
      // raw: true,
    });
    console.log("check users", users);
    return users;
  } catch (e) {
    console.log(">>error from get UserList ");
  }
};
const deleteUser = async (userId) => {
  await db.User.destroy({
    where: { id: userId },
  });
};
const getUserByid = async (id) => {
  let user = {};
  user = await db.User.findOne({
    where: { id: id },
  });
  return user.get({ plain: true });
};
const updateUserInfor = async (email, username, id) => {
  await db.User.update(
    {
      email: email,
      username: username,
    },
    {
      where: { id: id },
    }
  );
};
module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserByid,
  updateUserInfor,
};
