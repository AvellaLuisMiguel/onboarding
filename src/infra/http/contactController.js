// src/adapters/http/contactController.js
const ContactService = require('../../application/contactService');

const contactService = new ContactService();

const getAllContacts = (req, res) => {
    res.json(contactService.getAllContacts());
};

const getContactById = (req, res) => {
    const contact = contactService.getContactById(Number(req.params.id));
    if (contact) {
        res.json(contact);
    } else {
        res.status(404).send('Contact not found');
    }
};

const createContact = (req, res) => {
    const { name, email, phone } = req.body;
    const newContact = contactService.createContact(name, email, phone);
    res.status(201).json(newContact);
};

const updateContact = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    const updatedContact = contactService.updateContact(Number(id), name, email, phone);
    if (updatedContact) {
        res.json(updatedContact);
    } else {
        res.status(404).send('Contact not found');
    }
};

const deleteContact = (req, res) => {
    const contact = contactService.deleteContact(Number(req.params.id));
    if (contact) {
        res.json(contact);
    } else {
        res.status(404).send('Contact not found');
    }
};

module.exports = {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};