import expressValidator from "express-validator";
import passport from "passport";

import User from "../../models/user.js";
import { userLoginValidation } from "../../libs/general/validation-schemas/user.js";

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getAuthorizationOverview(req, res) {
  res.render("authorization/index", {
    title: "authorization overview"
  });
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getRegistration(req, res) {

  if (req.isAuthenticated()) {
    return res.redirect("/register");
  }
  res.render("authorization/registration", {
    title: "registration page"
  });
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export async function postRegistration(req, res, next) {
  const errors = expressValidator.validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("authorization/registration", {
      user: req.body,
      errors: errors.array()
    });
  }

  const { name, username, email, password } = req.body;

  const isOldUser = await User.exists({
    $or: [ {username}, {email} ]
  });

  if (isOldUser) {
    res.status(422).send("This email or username is already taken.")
  }

  try {
    const newUser = await User.create({
      name,
      username,
      email,
      password
    });

    return res.status(201).send("User registered");

  } catch (error) {
    next(error);
  }
  
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getLogin(req, res) {
  
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }

  res.render("authorization/login", {
    title: "login page"
  })
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
export function postLogin(req, res, next) {
  const errors = expressValidator.validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("authorization/login", {
      title: "login page",
      user: req.body,
      errors: errors.array()
    })
  }

  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: "User not found"
  },
  (error, req, res, next) => {
    if (error) next(error);
  })
  
}

/**
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getLogout(req, res) {
  req.logOut();
  res.redirect("/login")
}

/**
 * Validation middleware for `/authorization` route.
 * @param {() => {}} method 
 */
export function validateAuthorization(method) {
  const name = method.name;

  switch (name) {
    case postRegistration.name: return [
      expressValidator.body("name")
      .isLength({ min: 5, max: 25 })
      .withMessage("Name should be 5 to 25 characters long.")
      .matches(/[A-z0-9À-ž]+/)
      .trim()
      .escape(),

      expressValidator.body("username")
      .isLength({ min: 5, max: 15 })
      .withMessage("Username should be 5 to 15 characters long.")
      .matches(/[a-zA-Z0-9]+/)
      .trim()
      .escape(),

      expressValidator.body("email")
      .isEmail()
      .withMessage("Provide valid email.")
      .normalizeEmail(),

      expressValidator.body("password").
      isLength({ min: 8, max: 50 })
      .withMessage("Password should be between 8 to 50 characters long."),
    ];
      
    case postLogin.name: 
      return expressValidator.checkSchema(userLoginValidation);
       
    default:
      break;
  }
}