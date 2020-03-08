import {groupChat} from "../services";

let searchUsers = async (req, res) => {
  try {
    let searchKey = req.query.searchKey;
    let userId = req.user._id ; 
    
    let usersList = await groupChat.searchUsers(userId, searchKey);   
    let dataToRender = {
      usersList : usersList
    }   
    return res.status(200).render("server_render/groupChat/_searchUsers", dataToRender);
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  searchUsers : searchUsers
}