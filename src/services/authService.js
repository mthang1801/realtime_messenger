import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess, transEmail} from "../../lang/vi";
import sendEmail from "../config/mailer";
const saltRounds = 10;


let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {              
    try {
        let checkIsEmailExistence = await userModel.findByEmail(email);
      if(checkIsEmailExistence){    
        if(!checkIsEmailExistence.local.isActive){
          return reject(transErrors.email_isNotActive)
        }    
        if(checkIsEmailExistence.isBlocked){
          return reject(transErrors.email_isBlocked)
        }
        if(checkIsEmailExistence.deletedAt){
          return reject(transErrors.email_deleted);
        }       
        return reject(transErrors.email_existence);
      }
      let salt = bcrypt.genSaltSync(saltRounds);

      let newUserItem = {
        username : email.split("@")[0], 
        gender : gender,             
        local : {
          email : email,
          password : bcrypt.hashSync(password, salt),
          verifyToken : uuidv4()
        }       
      }               
      
      //send email      
      let linkVerify = `${protocol}://${host}/auth/user/verify/${newUserItem.local.verifyToken}`;     
      sendEmail(email, transEmail.mail_register_subject, transEmail.mail_register_template(email, linkVerify))
        .then( async success => {
          await userModel.createNew(newUserItem);
          resolve(transSuccess.email_register(email))
        })
        .catch( err => {
          reject(transErrors.send_email_failed);
        })
        
    }catch (error) {
      reject(error);
    }

  })
};

let verifyAccount = (token) => {
  return new Promise( async (resolve, reject) => {
    try {
      let activeAccount = await userModel.activeAccount(token);
      if(!activeAccount){
        return reject(transErrors.invalid_verify_token);
      }     
      resolve(transSuccess.activeAccount);
    } catch (error) {
      reject(transErrors.activeAccountFail);
    }
  })
}

module.exports ={
  register: register,
  verifyAccount : verifyAccount
}
