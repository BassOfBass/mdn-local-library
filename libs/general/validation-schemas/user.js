/**
 * @type import("express-validator").Schema
 */
export const userLoginValidation = {
  // name: {
  //   in: "body",
  //   isLength: {
  //     options: { min: 5, max: 25 },
  //     errorMessage: "Name should be 5 to 25 characters long."
  //   },
  //   matches: {
  //     options: /[A-z0-9À-ž]+/,
  //     errorMessage: "Name should consist of letters, numbers and underscores (no spaces)."
  //   },
  //   trim: true,
  //   escape: true,
  // },

  // username: {
  //   in: "body",
  //   isLength: {
  //     options: { min: 5, max: 15 },
  //     errorMessage: "Username should be 5 to 15 characters long."
  //   },
  //   matches: {
  //     options: /[a-zA-Z0-9]+/,
  //     errorMessage: "Username should consist of latin letters, numbers and underscores (no spaces)."
  //   },
  //   trim: true,
  //   escape: true
  // },

  email: {
    in: "body",
    isLength: {
      options: { min: 6, max: 254 },
      errorMessage: "Email should be 6 to 254 characters long."
    },
    isEmail: {
      errorMessage: "Your email is invalid."
    },
    normalizeEmail: true
  },

  password: {
    in: "body",
    isLength: {
      options: { min: 8, max: 50 },
      errorMessage: "Password should be 8 to 50 characters long."
    }
  }
}