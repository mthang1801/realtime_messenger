import {validationResult} from "express-validator/check";
import {auth} from "../services";
let getLoginRegister = (req,res) => {
  return res.render("authentication/master",{
    errors : req.flash("errors"), 
    success : req.flash("success"), 
    activeSuccess : req.flash("activeSuccess"),
    activeErrors : req.flash("activeErrors")
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
}
module.exports = {
  getLoginRegister : getLoginRegister,
  postRegister : postRegister,
  verifyAccount : verifyAccount
}
