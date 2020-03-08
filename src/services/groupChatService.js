import userModel from "../models/userModel";

/**
 * searching users except userId
 * @param {string} userId 
 * @param {string} searchKey 
 */
let searchUsers = (userId, searchKey) => {
  return new Promise(async (resolve, reject) => {
    try{    
      let usersList = await userModel.findUsersToAddNewGroup(userId, searchKey);      
      usersList.sort( (a,b) => a["username"].localeCompare(b["username"]));
      resolve(usersList);
    }catch (error) {
      reject(error);
    }
  })
}

module.exports ={
  searchUsers : searchUsers,
}