import {contact} from "../services";
import {promisify} from "util";
import ejs from "ejs";
import {convertToMessengerTimeStamp, getLastItemInArray} from "../helpers/clientHelper";
const renderFile = promisify(ejs.renderFile).bind(ejs);
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
};

let rejectRequestContact = async (req, res) => {
  try {
    let userId = req.body.userId ;
    let contactId = req.user._id ; //myself  
    let resultReject = await contact.rejectRequestContact(userId, contactId);
    return res.status(200).send({success : !!resultReject});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let acceptRequestContact = async (req, res) => {
  try {
    let userId = req.body.userId ; 
    let contactId = req.user._id ; //myself
    let data = await contact.acceptRequestContact(userId, contactId);  
    let user = data ; 
    
    return res.status(200).send({success : !!data, data : data});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let removeContact = async (req, res) => {
  try {
    let contactId = req.body.targetId;
    let userId = req.user._id; 
    let resultStatus = await contact.removeContact(userId, contactId);
    return res.status(200).send(resultStatus);
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreSearchAllUsers = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;
    let userId = req.user._id  ; 
    let searchKey = req.query.searchKey;  
    let listUsers = await contact.readMoreSearchAllUsers(userId, skipNumber, searchKey);
    return res.status(200).render("server_render/contact/_findUserContact.ejs", {listUsers});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreRequestContactSent = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;
    let userId = req.user._id;
    let listUsers = await contact.readMoreRequestContactSent(userId, skipNumber);
    return res.status(200).render("server_render/contact/_requestContactSent", {listUsers});
  } catch (error) {
    return res.status(500).send(error);
  }
};

let readMoreRequestContactReceived = async (req, res) => {
  try {
    let skipNumber = +req.query.skipNumber;
    let userId = req.user._id;
    let listUsers = await contact.readMoreRequestContactReceived(userId, skipNumber);
    return res.status(200).render("server_render/contact/_requestContactReceived", {listUsers})
  } catch (error) {
    return res.status(500).send(error);
  }
}
module.exports = {
  findUsersContact : findUsersContact,
  addContact : addContact,
  removeAddContact : removeAddContact,
  rejectRequestContact : rejectRequestContact,
  acceptRequestContact : acceptRequestContact,
  removeContact : removeContact,
  readMoreSearchAllUsers : readMoreSearchAllUsers,
  readMoreRequestContactSent : readMoreRequestContactSent,
  readMoreRequestContactReceived : readMoreRequestContactReceived,
}
