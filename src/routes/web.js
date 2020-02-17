import express from 'express';
import {home, auth} from "../controllers";
import {authValid} from "../validation";
import initPassportLocal from "../controllers/passportController/local";
import initPassportFacebook from "../controllers/passportController/fb";
import passport from "passport";


//init all passport
initPassportLocal();
initPassportFacebook();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */

let initRoutes = (app) => {
  router.get("/", auth.checkLoggedIn, home.getHome);  
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.post("/register", auth.checkLoggedOut, authValid.register , auth.postRegister);
  router.get("/auth/user/verify/:verifyToken", auth.checkLoggedOut, auth.verifyAccount);
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    failureFlash : true, 
    failureRedirect : "/login-register", 
    successFlash : true , 
    successRedirect : "/"
  }));
  router.get("/auth/facebook", auth.checkLoggedOut , passport.authenticate("facebook" , { scope : ["email"]}));
  router.get("/auth/facebook/callback", auth.checkLoggedOut , passport.authenticate("facebook" , {
    successRedirect : "/" ,
    failureRedirect : "/login-register" 
  }))
  router.get("/logout",auth.checkLoggedIn, auth.logoutAccount);

  return app.use(router);
}

module.exports = initRoutes;
