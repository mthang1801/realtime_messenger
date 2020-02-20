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

module.exports = {
  findUsersContact : findUsersContact
}
