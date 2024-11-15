const { ObjectId } = require('mongodb');
const Joi = require('joi');
const mongodb = require('../db/connection');

const contactsCont = {};

// Define validation schema for contact using Joi
const contactSchema = Joi.object({
  firstName: Joi.string().required().description('First name of the contact'),
  lastName: Joi.string().optional().description('Last name of the contact'),
  email: Joi.string()
    .email()
    .required()
    .description('Email address of the contact'),
  favoriteColor: Joi.string()
    .optional()
    .description('Favorite color of the contact'),
  birthday: Joi.date()
    .optional()
    .description('Birthday of the contact in YYYY-MM-DD format'),
});

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
      res.status(200).json(contacts);
    } else {
      res.status(404).json({ message: 'No contacts found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contacts', error });
  }
};

contactsCont.getContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  try {
    const contact = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .findOne({ _id: ObjectId.createFromHexString(contactId) });
    if (contact) {
      res.status(200).json(contact);
    } else {
      res
        .status(404)
        .json({ message: `Contact with id ${contactId} not found` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contact', error });
  }
};

contactsCont.addContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { error, value } = contactSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: 'Invalid contact data', details: error.details });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .insertOne(value);
    res
      .status(201)
      .json({ message: 'Contact created', contactId: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: 'Error creating contact', err });
  }
};

contactsCont.updateContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid contact ID format' });
  }

  const updateSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    favoriteColor: Joi.string().optional(),
    birthday: Joi.date().optional(),
  });

  const { error, value } = updateSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: 'Invalid contact data', details: error.details });
  }

  if (Object.keys(value).length === 0) {
    return res
      .status(400)
      .json({ message: 'At least one field must be provided for update' });
  }

  try {
    const result = await mongodb
      .getDatabase()
      .db('Contactsdb')
      .collection('contacts')
      .updateOne(
        { _id: ObjectId.createFromHexString(contactId) },
        { $set: value },
      );

    if (result.matchedCount === 0) {
      res
        .status(404)
        .json({ message: `Contact with id ${contactId} not found` });
    } else {
      res.status(200).json({ message: 'Contact updated successfully' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error updating contact', err });
  }
};

contactsCont.deleteContactById = async (req, res) => {
  // #swagger.tags=['Contacts']
  const { contactId } = req.params;

  if (!ObjectId.isValid(contactId)) {
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
      res.status(200).json({ message: 'Contact deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
};

module.exports = contactsCont;
