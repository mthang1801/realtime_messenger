import express from 'express';
import {home, auth, user, contact, notification, conversation, groupChat} from "../controllers/index";
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
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);
  router.get("/", auth.checkLoggedIn, home.getHome);  
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
  router.put("/user/forgot-password", auth.checkLoggedOut, auth.forgotPassword);
  router.get("/user/forgot-password/verify", auth.checkLoggedOut, auth.verifyForgotPassword);
  router.put("/user/forgot-password/new-update-password", auth.checkLoggedOut, auth.updateNewPassword);
  //update user avatar, information and password
  router.put("/user/update-avatar", auth.checkLoggedIn , user.updateAvatar);
  router.put("/user/update-info", auth.checkLoggedIn, userValid.userUpdateInfo, user.updateInfo);
  router.put("/user/update-password", auth.checkLoggedIn, userValid.userUpdatePassword, user.updatePassword);
  //contact section
  router.get("/contact/find-users", auth.checkLoggedIn, contact.findUsersContact); 
  router.post("/contact/add-contact" , auth.checkLoggedIn, contact.addContact);
  router.delete("/contact/remove-add-contact", auth.checkLoggedIn, contact.removeAddContact);
  router.delete("/contact/reject-request-contact", auth.checkLoggedIn, contact.rejectRequestContact);
  router.put("/contact/accept-request-contact-received", auth.checkLoggedIn, contact.acceptRequestContact);
  router.delete("/contact/remove-contact", auth.checkLoggedIn, contact.removeContact);
  router.get("/contact/read-more-search-all-users", auth.checkLoggedIn, contact.readMoreSearchAllUsers);
  router.get("/contact/read-more-request-contact-sent", auth.checkLoggedIn, contact.readMoreRequestContactSent);
  router.get("/contact/read-more-request-contact-received", auth.checkLoggedIn, contact.readMoreRequestContactReceived);
  //notification
  router.get("/notification/read-more-notifications", auth.checkLoggedIn, notification.readMoreNotification);
  router.get("/notification/info", auth.checkLoggedIn, notification.getNotificationInfo);
  router.get("/notification/read-all", auth.checkLoggedIn, notification.readAllNotifications);
  router.put("/notification/mark-as-read-all-notifications", auth.checkLoggedIn, notification.markAsReadAllNotifications);
  router.get("/notification/get-notifications", auth.checkLoggedIn, notification.getNotifications);
  //conversation
  router.post("/conversation/chat-text-and-emoji", auth.checkLoggedIn, conversation.chatTextAndEmoji);
  router.put("/conversation/update-message-has-been-received", auth.checkLoggedIn, conversation.updateMessageHasBeenReceived);
  router.put("/conversation/receiver-has-seen-message", auth.checkLoggedIn, conversation.receiverHasSeenMessage);
  router.put("/conversation/delete-conversation", auth.checkLoggedIn, conversation.removeConversation);
  router.get("/conversation/get-user-conversation", auth.checkLoggedIn, conversation.getUserConversation);
  router.post("/conversation/chat-image", auth.checkLoggedIn, conversation.chatImage);
  router.post("/conversation/chat-attachment", auth.checkLoggedIn, conversation.chatAttachment);
  router.get("/conversation/read-more-messengers", auth.checkLoggedIn, conversation.readMoreMessengers);
  //group-chat
  router.get("/group-chat/search-users" , auth.checkLoggedIn, groupChat.searchUsers)
  return app.use(router);
}

module.exports = initRoutes;
