import userModel from "../models/userModel";
import contactModel from "../models/contactModel";
import {transErrors} from "../../lang/vi";
/**
 * 
 * @param {string} currentUserId 
 * @param {string} searchKey 
 * 1. get ContactId from contact List which contains userId 
 * 2. save contactId into deprecatedUserId in order not to appear when search
 * 
 */
let findUsersContact = (currentUserId, searchKey) => {
  return new Promise( async (resolve, reject) => {
    try {
      let deprecatedUsersId = [currentUserId.toString()] ;      
      let contactList = await contactModel.findAllContactByUserId(currentUserId);
      contactList.forEach( contact => {
        if(contact.userId == currentUserId){
          deprecatedUsersId.push(contact.contactId.toString());
          return;
        }
        deprecatedUsersId.push(contact.userId.toString());
      })    
     
      let usersList = await userModel.findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey);
      resolve(usersList);
    } catch (error) {
      reject(error);
    }
  })
};
/**
 * 
 * @param {string} userId 
 * @param {string} contactId 
 * create contact 
 */
let addContact = (userId, contactId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkContactExist = await contactModel.checkContactExist(userId, contactId);
      if(checkContactExist){
        return reject(transErrors.existed_contact);
      }
      let newContactItem = {
        userId : userId , 
        contactId : contactId
      }
      let newContact = await contactModel.createNew(newContactItem);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};

let removeAddContact = (userId, contactId) => {
  return new Promise( async(resolve, reject) => {
    try {
      let checkAndRemoveContact = await contactModel.checkAndRemoveContact(userId, contactId);
      console.log(checkAndRemoveContact);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  findUsersContact: findUsersContact,
  addContact : addContact,
  removeAddContact : removeAddContact
}
