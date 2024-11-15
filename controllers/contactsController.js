const { ObjectId } = require('mongodb');
const mongodb = require('../db/connection');

const contactsCont = {};

contactsCont.getContacts = async (req, res) => {
  // #swagger.tags=['Contacts']
  try {
    const contacts = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .find()
      .toArray();
    if (contacts.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(contacts);
    } else {
      res.status(404).json({ message: 'No contacts found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while retrieving contacts', error });
  }
};

contactsCont.getContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .findOne({ _id: ObjectId.createFromHexString(contactId) });
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: `Contact of id ${contactId} not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while retrieving contact', error });
  }
};

contactsCont.addContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  const contact = req.body;

  if (
    !contact ||
    typeof contact !== 'object' ||
    Object.keys(contact).length === 0
  ) {
    return res.status(400).json({ message: 'Invalid contact data' });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .insertOne(contact);
    res.setHeader('Content-Type', 'application/json');
    res
      .status(201)
      .json({ message: 'Contact created', contactId: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while creating contact', error });
  }
};

contactsCont.updateContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;
  const contact = req.body;

  if (!contactId) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  if (!contact || typeof contact !== 'object') {
    return res.status(400).json({ message: 'Invalid contact data' });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .updateOne(
        { _id: ObjectId.createFromHexString(contactId) },
        { $set: contact },
      );

    if (result.matchedCount === 0) {
      res
        .status(404)
        .json({ message: `Contact with id ${contactId} not found` });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Contact updated successfully' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while updating contact', error });
  }
};

contactsCont.deleteContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;

  if (!contactId) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .deleteOne({ _id: ObjectId.createFromHexString(contactId) });

    if (result.deletedCount === 0) {
      res
        .status(404)
        .json({ message: `Contact with id ${contactId} not found` });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ message: 'Contact deleted successfully' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while deleting contact', error });
  }
};

module.exports = contactsCont;
