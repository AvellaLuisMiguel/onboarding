// src/adapters/http/server.js
const express = require('express');
const bodyParser = require('body-parser');
const contactController = require('./contactController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/contacts', contactController.getAllContacts);
app.get('/contacts/:id', contactController.getContactById);
app.post('/contacts', contactController.createContact);
app.put('/contacts/:id', contactController.updateContact);
app.delete('/contacts/:id', contactController.deleteContact);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});