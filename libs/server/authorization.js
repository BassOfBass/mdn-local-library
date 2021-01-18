import passportLocal from "passport-local";

import User from "../../models/user.js";

/**
 * @param {import("express").Express} app 
 * @param {import("passport").PassportStatic} passport 
 */
export function initializePassport(app, passport) {
  passport.use(new passportLocal.Strategy( async(username, password, done) => {

    try {
      const authUser = await User.authenticate(username, password);
      done(null, authUser);
    } catch (error) {
      done(error);
    }
    
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id)
  });

  passport.deserializeUser( async (id, done) => {

    try {
      const user = await User.findOne({ id });
      done(null, user);
    } catch (error) {
      done(error);
    }
    
  });

  app.use(passport.initialize())
  app.use(passport.session())
}
