const router = require('express').Router();
const contactsController = require('../controllers/contactsController');

router.get('/', contactsController.getContacts);
router.get('/:contactId', contactsController.getContactById);

module.exports = router;