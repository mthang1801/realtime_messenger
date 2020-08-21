import userModel from "../models/userModel";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { transErrors, transSuccess, transEmail } from "../../lang/vi";
import sendEmail from "../config/mailer";
const saltRounds = +process.env.SALT_ROUNDS;

let register = (email, gender, password, protocol, host) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkIsEmailExistence = await userModel.findByEmail(email);
      if (checkIsEmailExistence) {
        if (!checkIsEmailExistence.local.isActive) {
          return reject(transErrors.email_isNotActive);
        }
        if (checkIsEmailExistence.isBlocked) {
          return reject(transErrors.email_isBlocked);
        }
        if (checkIsEmailExistence.deletedAt) {
          return reject(transErrors.email_deleted);
        }
        return reject(transErrors.email_existence);
      }

      let salt = bcrypt.genSaltSync(saltRounds);

      let newUserItem = {
        username: email.split("@")[0],
        gender: gender,
        avatar:
          gender == "male"
            ? "avatar-default-man.jpeg"
            : "avatar-default-woman.png",
        local: {
          email: email.trim().toLowerCase(),
          password: bcrypt.hashSync(password, salt),
          verifyToken: uuidv4(),
        },
      };
      let user = await userModel.createNew(newUserItem);
      //send email
      let linkVerify = `${protocol}://${host}/auth/user/verify/${newUserItem.local.verifyToken}`;
      sendEmail(
        email,
        transEmail.mail_register_subject,
        transEmail.mail_register_template(email, linkVerify)
      )
        .then(async (success) => {
          resolve(transSuccess.email_register(email));
        })
        .catch(async (err) => {
          await userModel.removeUserById(user._id);
          reject(transErrors.send_email_failed);
        });
    } catch (error) {
      reject(error);
    }
  });
};

let verifyAccount = (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      let activeAccount = await userModel.activeAccount(token);
      if (!activeAccount) {
        return reject(transErrors.invalid_verify_token);
      }
      resolve(transSuccess.activeAccount);
    } catch (error) {
      reject(transErrors.activeAccountFail);
    }
  });
};

/**
 *
 * @param {email} String email
 * find user in documents, if user exists, it will create number verify code in order to user get link in email, else return false to notify error
 */
let forgotPassword = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await userModel.findUserAndCreateNumberVerify(email);
      if (!user) {
        return reject(transErrors.email_not_existence);
      }
      //send email to user to get verify number
      sendEmail(
        email,
        transEmail.mail_forgot_subject,
        transEmail.mail_forgot_template(user.username, user.local.verifyNumber)
      )
        .then((success) => resolve(transSuccess.mail_forgot_success))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};
/**
 *
 * @param {String} email
 * @param {Number} verifyNumber
 * check user has whether existed or not, if existed, return true else return false
 */
let verifyForgotPassword = (email, verifyNumber) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await userModel.findUserByEmailAndVerifyNumber(
        email,
        verifyNumber
      );
      if (!user) {
        return reject(transErrors.verifyNumber_wrong);
      }
      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });
};

/**
 *
 * @param {String} email
 * @param {String} password
 * proceed update new password from forgot password
 */
let updateNewPassword = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let salt = bcrypt.genSaltSync(saltRounds);
      let hashPassword = bcrypt.hashSync(password, salt);
      let userUpdate = await userModel.FindUserByEmailAndUpdateNewPassword(
        email,
        hashPassword
      );
      if (!userUpdate) {
        return reject(transErrors.server_error);
      }
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  register: register,
  verifyAccount: verifyAccount,
  forgotPassword: forgotPassword,
  verifyForgotPassword: verifyForgotPassword,
  updateNewPassword: updateNewPassword,
};
