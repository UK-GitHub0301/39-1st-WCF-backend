const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const userDao = require("../models/userDao");
const { raiseCustomError } = require("../utils/error");
const { validateUsername, validatePw } = require("../utils/validate");

const signUp = async (
  username,
  password,
  name,
  mobile_number,
  email,
  address
) => {
  validateUsername(username);
  validatePw(password);

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await userDao.createUser(
    username,
    hashedPassword,
    name,
    mobile_number,
    email,
    address
  );

  return user;
};

const signIn = async (username, password, res) => {
  validateUsername(username);
  validatePw(password);

  const user = await userDao.getUserByUsername(username);

  const is_match = await bcrypt.compare(password, user.password);

  if (!is_match) {
    return raiseCustomError("INVALID USER", 401);
  }

  const payLoad = { userId: user.id };
  const accessToken = jwt.sign(payLoad, secretKey);
  return accessToken;
};

const getUserById = async (id) => {
  return await userDao.getUserById(id);
};

module.exports = {
  signUp,
  signIn,
  getUserById,
};
