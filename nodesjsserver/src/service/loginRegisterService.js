import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";

const salt = bcrypt.genSaltSync(10);
const hashUserPassword = (userPassword) => {
  let hashPassword = bcrypt.hashSync(userPassword, salt);
  return hashPassword;
};
const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });
  if (user) {
    return true;
  }
  return false;
};
const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });
  if (user) {
    return true;
  }
  return false;
};
const registerNewUser = async (rawUserData) => {
  try {
    // check user are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "The email is already exist",
        ER: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "The phone number is already exist",
        EC: 1,
      };
    }

    //hash password
    let hassPassword = hashUserPassword(rawUserData.password);
    //create a new user
    await db.User.create({
      email: rawUserData.email,
      username: rawUserData.email,
      password: hassPassword,
      phone: rawUserData.phone,
    });
    return {
      EM: "A new user is created successfully!",
      EC: 0,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrong when you try to create a new user",
      EC: -2,
    };
  }
};
const checkPassword = (inputPassword, hashPassword) => {
  //hashPassword la o duoi DB con inputPassword la lay tu react
  return bcrypt.compareSync(inputPassword, hashPassword); //true or false
};

const handleUserLogin = async (rawData) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });
    if (user) {
      console.log(">>>found user");
      let isCorrectPassword = await checkPassword(
        rawData.password,
        user.password
      );
      if (isCorrectPassword === true) {
        return {
          EM: "oke!",
          EC: 0,
          DT: "",
        };
      }
    }
    console.log(
      ">>>input email or phone",
      rawData.valueLogin,
      "password",
      rawData.password
    );
    return {
      EM: "Your email/phone number or password is incorrect",
      EC: 1,
      DT: "",
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs in handleUserLogin",
      EC: -2,
      // DT: "",
    };
  }
};
module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
};
