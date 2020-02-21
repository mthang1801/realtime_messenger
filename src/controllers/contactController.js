import {contact} from "../services";

let findUsersContact = async (req, res) => {
  try {
    let searchKey = req.query.searchKey;
    let currentUserId = req.user._id;
    let listUsers = await contact.findUsersContact(currentUserId, searchKey);

    return res.status(200).render("server_render/contact/_findUserContact.ejs", {listUsers})
  } catch (error) {
    return res.status(500).send(error);
  }
};

let addContact = async(req, res) => {
  try {
    let contactId = req.body.contactId;
    let userId = req.user._id;
    let contactInfor = await contact.addContact(userId, contactId);
    return res.status(200).send({success: !!contactInfor, data : contactInfor});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeAddContact = async (req, res) => {
  try {
    let contactId = req.body.contactId;
    let userId = req.user._id ;
    let removeAddContactStatus = await contact.removeAddContact(userId, contactId) ;
    return res.status(200).send({success: !!removeAddContactStatus});
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  findUsersContact : findUsersContact,
  addContact : addContact,
  removeAddContact : removeAddContact,
}
