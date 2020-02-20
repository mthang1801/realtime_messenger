import passport from "passport";
import passportFacebook from "passport-facebook";
import {transErrors, transSuccess} from "../../../lang/vi";
import userModel from "../../models/userModel";
let facebookStrategy = passportFacebook.Strategy;

const fbAppId = process.env.FB_APP_ID;
const fbAppSecret = process.env.FB_APP_SECRET;
const fbCbURL = process.env.FB_CALLBACK_URL;
let initPassportFacebook = () => {
  passport.use(new facebookStrategy({
    clientID : fbAppId,
    clientSecret : fbAppSecret,
    callbackURL : fbCbURL,
    passReqToCallback : true,
    profileFields : ["displayName", "gender", "photos", "email"]
  },async(req, accessToken, refreshToken, profile, done) => {
    try {      
      let user = await userModel.findUserByFacebookUID(profile.id);  
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
        username : profile.displayName, 
        gender : profile.gender,                                
        local : {         
          isActive : true,          
        },        
        facebook : {
          uid : profile.id,
          token : accessToken , 
          email :profile.emails[0].value
        }
      }
      let newUser = await userModel.createNew(newUserItem);
      return done(null, newUser, req.flash("activeSuccess", transSuccess.login_success(newUser.username)))
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

module.exports = initPassportFacebook;