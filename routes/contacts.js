const router = require('express').Router();
const contactsController = require('../controllers/contactsController');

router.get('/', contactsController.getContacts);
router.get('/:contactId', contactsController.getContactById);
router.post('/', contactsController.addContact);
router.put('/:contactId', contactsController.updateContactById);
router.delete('/:contactId', contactsController.deleteContactById);

module.exports = router;
