const mongodb = require("../db/connection");
const ObjectId = require('mongodb').ObjectId;

const contactsCont = {};

contactsCont.getContacts = async (req, res) => {
  const result = await mongodb.getDatabase().db("Contactsdb").collection("contacts").find();
  if (result) {
    result.toArray().then((contacts) => {
      if (contacts.length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(contacts);
      } else {
        res.status(404).json({ message: "No contacts found" });
      }
    });
  } else {
    res.status(500).json({ message: "An error occurred while retrieving contacts" });
  }
};

contactsCont.getContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Invalid contact ID format" });
  }

  const result = await mongodb.getDatabase().db("Contactsdb").collection("contacts").findOne({ _id: ObjectId.createFromHexString(contactId) });

  if (result) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } else {
    res.status(404).json({ message: `Contact of id ${contactId} not found` });
  }
};

module.exports = contactsCont;
