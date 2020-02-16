import passport from "passport";
import passportLocal from "passport-local";
import userModel from "../../models/userModel";
import {transErrors, transSuccess} from "../../../lang/vi";
let localStrategy = passportLocal.Strategy;

/**
 * valid  type local account
 */
let initPassportLocal = () => {
  passport.use(new localStrategy({
    usernameField : "email",
    passwordField : "password", 
    passReqToCallback : true
  }, async (req, email, password, done) => {
    try {
      let user = await userModel.findByEmail(email);
      if(!user){
        return done(null,null, req.flash("activeErrors", transErrors.email_not_existence));
      }
      if(!user.local.isActive){
        return done(null, null, req.flash("activeErrors", transErrors.email_isNotActive) );
      }
      if(user.deletedAt){
        return done(null, null, req.flash("activeErrors", transErrors.email_deleted));
      }
      if(user.isBlocked){
        return done(null, null, req.flash("activeErrors", transErrors.email_isBlocked));
      }
      let checkPassword  = await user.comparePassword(password);
    
      if(!checkPassword){
        return done(null, false, req.flash("activeErrors", transErrors.username_or_password_wrong));
      }
      return done(null, user, req.flash("activeSuccess", transSuccess.login_success(user.username)));
    } catch (error) {
      return done(null, null, req.flash("activeErrors", error.toString()));
    }
  }));

  //save user account into session mongodb
  passport.serializeUser( (user,done) => {
    done(null, user._id);
  })

  //when make request, this get user info and generate req.user 
  passport.deserializeUser( (id, done) =>{
    userModel.findUserById(id)
      .then(user => {
        done(null, user);
      })
      .catch(err =>{
        done(error,null);
      })
  })
}

module.exports = initPassportLocal;