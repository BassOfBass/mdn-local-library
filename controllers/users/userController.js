import User from "../../models/user.js";

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function getUserList(req, res, next) {
  try {
    const users = await User.find({}).lean();

    if (!users) {
      const newUser = new User({
        name: process.env.FIRST_NAME,
        email: process.env.FIRST_EMAIL,
        username: process.env.FIRST_USERNAME,
        password: process.env.FIRST_PASSWORD,
      })
      const savedUser = await newUser.save();
      console.log(savedUser);
    }

    res.render("users/index", {
      users
    })

  } catch (error) {
    next(error);
  }
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function getUserDetails(req, res, next) {
  res.send("TBD");
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function postUserDetails(req, res, next) {
  res.send("TBD");
}