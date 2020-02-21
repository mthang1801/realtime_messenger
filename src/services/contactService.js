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
      let listUserId = [];
      let contactStatusTrueList = await contactModel.findAllContactWithStatusTrueByUserId(currentUserId);
      contactStatusTrueList.forEach( contact => {
        if(contact.userId == currentUserId){
          deprecatedUsersId.push(contact.contactId.toString());         
          return;
        }
        deprecatedUsersId.push(contact.userId.toString());
      })    
      let contactStatusFalseList = await contactModel.findAllContactWithStatusFalseByUserId(currentUserId);       
      let usersList = await userModel.findUserWithDeprecatedUsersId(deprecatedUsersId, searchKey);
      let newUsersList = [];
      usersList.forEach( (user, index) => {
        user = user.toObject();
        user.hasContact = false; // not contact
        for(let i  = 0 ; i < contactStatusFalseList.length ; i++){
          if(contactStatusFalseList[i].contactId == user._id || contactStatusFalseList[i].userId == user._id ){
            user.hasContact = true; // has contact but false
            break;
          }          
        }  
        newUsersList.push(user);      
      })        
      resolve(newUsersList); 
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
      let getContactInfo = await userModel.findUserById(contactId);                  
     
      resolve({contactCreatedAt : newContact.createdAt, getContactInfo});
    } catch (error) {
      reject(error);
    }
  })
};

let removeAddContact = (userId, contactId) => {
  return new Promise( async(resolve, reject) => {
    try {
      let checkAndRemoveContact = await contactModel.checkAndRemoveContact(userId, contactId);      
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
