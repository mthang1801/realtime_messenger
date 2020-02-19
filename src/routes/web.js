import express from 'express';
import {home, auth, user} from "../controllers";
import {authValid, userValid} from "../validation";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/fb";
import initPassportGoogle from "../controllers/passportController/google";
import passport from "passport";

//init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  //home page and login-register page
  router.get("/", auth.checkLoggedIn, home.getHome);  
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  //register 
  router.post("/register", auth.checkLoggedOut, authValid.register , auth.postRegister);
  //login account with local, facebook, google
  router.get("/auth/user/verify/:verifyToken", auth.checkLoggedOut, auth.verifyAccount);
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    failureFlash : true, 
    failureRedirect : "/login-register", 
    successFlash : true , 
    successRedirect : "/"
  }));
  router.get("/auth/facebook", auth.checkLoggedOut , passport.authenticate("facebook" , { scope : ["profile"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut , passport.authenticate("facebook" , {
    successRedirect : "/" ,
    failureRedirect : "/login-register" 
  }));
  router.get("/auth/google", auth.checkLoggedOut, passport.authenticate("google", {scope : ["email"]}));
  router.get("/auth/google/callback", auth.checkLoggedOut, passport.authenticate("google", {
    failureRedirect : "/login-register", 
    successRedirect : "/"
  }));
  //logout account
  router.get("/logout",auth.checkLoggedIn, auth.logoutAccount);
  //forgot password
  router.post("/user/forgot-password", auth.checkLoggedOut, auth.forgotPassword);
  router.post("/user/forgot-password/verify", auth.checkLoggedOut, auth.verifyForgotPassword);
  router.post("/user/forgot-password/verify/new-update-password", auth.checkLoggedOut, auth.updateNewPassword);
  //update user avatar and information
  router.put("/user/update-avatar", auth.checkLoggedIn , user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.userUpdate, user.updateInfo)
  return app.use(router);
}

module.exports = initRoutes;
