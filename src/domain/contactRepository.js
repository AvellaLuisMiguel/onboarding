class ContactRepository {
    constructor() {
        this.contacts = [];
        this.currentId = 1;
    }

    findAll() {
        return this.contacts;
    }

    findById(id) {
        return this.contacts.find(contact => contact.id === id);
    }

    create(contact) {
        contact.id = this.currentId++;
        this.contacts.push(contact);
        return contact;
    }

    update(updatedContact) {
        const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
        if (index !== -1) {
            this.contacts[index] = updatedContact;
            return updatedContact;
        }
        return null;
    }

    delete(id) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            return this.contacts.splice(index, 1)[0];
        }
        return null;
    }
}

module.exports = ContactRepository;