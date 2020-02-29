import passport from "passport";
import passportGoogle from "passport-google-oauth";
import {transSuccess, transErrors} from "../../../lang/vi";
import userModel from "../../models/userModel";
import { reject } from "bluebird";
let googleStrategy = passportGoogle.OAuth2Strategy;

const ggAppId = process.env.GG_APP_ID;
const ggAppSecret = process.env.GG_APP_SECRET;
const ggCbURL = process.env.GG_CALLBACK_URL;

let initPassportGoogle = () => {
  passport.use(new googleStrategy({
    clientID : ggAppId,
    clientSecret : ggAppSecret,
    callbackURL : ggCbURL,
    passReqToCallback : true 
  },async (req, accessToken, refreshToken, profile, done) => {
    try {
      let user = await userModel.findUserByGoogleUID(profile.id);
      if(user){
        if(!user.local.isActive){
          return done(null, null, req.flash("activeErrors", transErrors.email_isNotActive) );
        }
        if(user.deletedAt){
          return done(null, null, req.flash("activeErrors", transErrors.email_deleted));
        }
        if(user.isBlocked){
          return done(null, null, req.flash("activeErrors", transErrors.email_isBlocked));
        }
        return done(null, user, req.flash("activeSuccess", transSuccess.login_success(user.username)));
      }
      let newUserItem = {
        username : profile.displayName === undefined? profile.emails[0].value.split("@")[0] : profile.displayName, 
        gender : profile.gender,                                
        local : {         
          isActive : true,          
        },        
        google : {
          uid : profile.id,
          token : accessToken , 
          email :profile.emails[0].value
        }
      }
      let newUser = await userModel.createNew(newUserItem);
      return done(null, newUser, req.flash("activeSuccess" , transSuccess.login_success(newUser.username)));
    } catch (error) {
      done(null, null, req.flash("activeErrors", error.toString()));
    }
  }));

  passport.serializeUser( (user, done) => {
    return done(null, user._id);
  })

  passport.deserializeUser( async (id, done) => {
    try {
      let user = await userModel.findUserById(id);
      let listGroupsContainUser = await groupChatModel.findGroupConversationByUserId(id);
      let listGroupsId  = [];
      listGroupsContainUser.forEach( group => {
        listGroupsId.push(group._id);
      })
      user = user.toObject();
      user.listGroupsId = listGroupsId;      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  })
}

module.exports = initPassportGoogle;
