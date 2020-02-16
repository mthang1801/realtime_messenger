import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import {transErrors, transSuccess} from "../../lang/vi";

const saltRounds = 10;


let register = (email, gender, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = email.split("@")[0];
      let salt = bcrypt.genSaltSync(saltRounds);

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
      let newUserItem = {
        username : username, 
        gender : gender,             
        local : {
          email : email,
          password : bcrypt.hashSync(password, salt),
          verifyToken : uuidv4()
        }       
      }
      let newUser = await userModel.createNew(newUserItem);
      resolve(transSuccess.email_register(email));
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  register: register
}
