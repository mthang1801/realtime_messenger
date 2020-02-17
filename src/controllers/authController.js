import {validationResult} from "express-validator/check";
import {auth} from "../services";
import {transSuccess, transErrors, authInvalidation} from "../../lang/vi";
let getLoginRegister = (req,res) => {
  return res.render("authentication/master",{
    //show at register form
    errors : req.flash("errors"), 
    success : req.flash("success"), 
    //show at login form
    activeSuccess : req.flash("activeSuccess"),
    activeErrors : req.flash("activeErrors"),
    //when request password, flash will show at forgot form
    requestErrors : req.flash("requestErrors"),
    requestSuccess : req.flash("requestSuccess")
  });
};

let postRegister = async(req,res) => {
  let arrErrors = []; 
  let arrSuccess = [];
  if(!validationResult(req).isEmpty()){
    let errors = Object.values(validationResult(req).mapped());
    errors.forEach( error => {
      arrErrors.push(error.msg);
    })
    req.flash("errors" , arrErrors);
    console.log(arrErrors);
    return res.redirect("/login-register");
  }
  try {
    let email = req.body.email;
    let gender = req.body.gender;
    let password = req.body.password;    
    let registerResult = await auth.register(email, gender, password, req.protocol, req.get("host"));    
    arrSuccess.push(registerResult);
    req.flash("success", arrSuccess);
    return res.redirect("/login-register");
  } catch (error) {
    arrErrors.push(error);
    req.flash("errors" ,arrErrors);   ;
    return res.redirect("/login-register");
  }
};

/**
 * Active account from email
 */
let verifyAccount =async (req, res) => {
  try{
    let params = req.params.verifyToken;
    let verifyResult = await auth.verifyAccount(params);
    req.flash("activeSuccess" , verifyResult);
    return res.redirect("/login-register");
  }catch(err){
    req.flash("activeErrors", err);
    return res.redirect("/login-register");
  }
};

let checkLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    return res.redirect("/login-register");
  }
  next();
};

let checkLoggedOut = (req,res,next) => {
  if(req.isAuthenticated()){
    return res.redirect("/");
  }
  next();
};

let logoutAccount = (req,res) => {
  req.logout() ; 
  req.flash("activeSuccess" , transSuccess.loggout_success) ;
  return res.redirect("/login-register");
};

//request reset password through verifying with email
let forgotPassword = async (req, res) => {  
  let email = req.body.email;
  let confirm_email = req.body.confirm_email;
  if(email !== confirm_email){
    return res.status(500).send(authInvalidation.confirm_email_wrong);
  }
  try {
    let status = await auth.forgotPassword(email);
    return res.status(200).send({email : email , success : status});
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

let verifyForgotPassword = async (req, res) => {
  let email = req.body.email;
  let verifyNumber = req.body.verifyNumber; 
  if(email == "" || verifyNumber == ""){
    return res.status(500).send(transErrors.empty_request);
  }
  try {
    let status = await auth.verifyForgotPassword(email, verifyNumber);
    console.log(status);
    return res.status(200).send({success : !!status});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let updateNewPassword = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  console.log(email);
  console.log(password);
  if(email == "" || password == ""){
    return res.status(500).send(transErrors.empty_request);
  }
  try {
    let status = await auth.updateNewPassword(email, password);
    console.log("This is" + status);
    return res.status(200).send(status);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  getLoginRegister : getLoginRegister,
  postRegister : postRegister,
  verifyAccount : verifyAccount,
  checkLoggedIn : checkLoggedIn,
  checkLoggedOut : checkLoggedOut,
  logoutAccount : logoutAccount,
  forgotPassword : forgotPassword,
  verifyForgotPassword : verifyForgotPassword,
  updateNewPassword : updateNewPassword
}
