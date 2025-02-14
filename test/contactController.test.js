const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const contactController = require('../src/infra/http/contactController');

const app = express();
app.use(bodyParser.json());
app.get('/contacts', contactController.getAllContacts);
app.get('/contacts/:id', contactController.getContactById);
app.post('/contacts', contactController.createContact);
app.put('/contacts/:id', contactController.updateContact);
app.delete('/contacts/:id', contactController.deleteContact);

describe('Contact Management API', () => {
    it('should create a new contact', async () => {
        const res = await request(app)
            .post('/contacts')
            .send({
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '123456789',
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Juan Pérez');
    });

    it('should get all contacts', async () => {
        const res = await request(app).get('/contacts');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get a contact by ID', async () => {
        const createRes = await request(app)
            .post('/contacts')
            .send({
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '123456789',
            });

        const res = await request(app).get(`/contacts/${createRes.body.id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Juan Pérez');
    });

    it('should update a contact', async () => {
        const createRes = await request(app)
            .post('/contacts')
            .send({
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '123456789',
            });

        const res = await request(app)
            .put(`/contacts/${createRes.body.id}`)
            .send({
                name: 'Juan Pérez Actualizado',
                email: 'juan.perez.actualizado@example.com',
                phone: '987654321',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Juan Pérez Actualizado');
    });

    it('should delete a contact', async () => {
        const createRes = await request(app)
            .post('/contacts')
            .send({
                name: 'Juan Pérez',
                email: 'juan.perez@example.com',
                phone: '123456789',
            });

        const res = await request(app).delete(`/contacts/${createRes.body.id}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Juan Pérez');
    });
});