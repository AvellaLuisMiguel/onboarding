const Contact = require('../domain/contact');
const ContactRepository = require('../domain/contactRepository');

class ContactService {
    constructor() {
        this.repository = new ContactRepository();
    }

    getAllContacts() {
        return this.repository.findAll();
    }

    getContactById(id) {
        return this.repository.findById(id);
    }

    createContact(name, email, phone) {
        const contact = new Contact(null, name, email, phone);
        return this.repository.create(contact);
    }

    updateContact(id, name, email, phone) {
        const contact = new Contact(id, name, email, phone);
        return this.repository.update(contact);
    }

    deleteContact(id) {
        return this.repository.delete(id);
    }
}

module.exports = ContactService;