import * as chai from 'chai'; // Importar chai usando importación global para ES modules
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const testMessage = { name: 'Edgar73', email: 'Juan@cielo.com', message: 'Hola Todos desde el tests' };

describe('Tests integracion', function () {
    let messageId 
    describe('Tests DAO Messages', function () {
        before(function () { });
        beforeEach(function () { });
        after(function () { });
        afterEach(function () { });

        it('GET /api/messages debe retornar un array de mensajes', async function () {
            const { statusCode, ok, _body } = await requester.get('/api/messages');

            expect(_body.payload).to.be.an('array');
            expect(statusCode).to.be.equals(200)
        });

        it('POST /api/messages debe cargar correctamente un mensaje', async function () {
            const { statusCode, ok, _body } = await requester.post('/api/messages').send(testMessage);

            expect(_body.payload).to.have.property('_id');
            
            messageId = _body.payload._id
        });

        it('POST /api/messages sin email debe retornar 400', async function () {
            const {email, ...messagesFilter} = testMessage
            const { statusCode, ok, _body } = await requester.post('/api/messages').send(messagesFilter);

            expect(statusCode).to.be.equals(400)

        });


        it('PUT /api/messages/:id debe actualizar correctamente un mensaje', async function () {
            const messageUpdate = { message: 'Hola todos actualizado' };
            const { statusCode, ok, _body } = await requester.put(`/api/messages/${messageId}`).send(messageUpdate);
            
           // expect(statusCode).to.be.equals(200);
            expect(_body.payload).to.have.property('message').that.equals(messageUpdate.message);
        });


        it('DELETE /api/messages/:id debe eliminar correctamente un mensaje', async function () {
            const { statusCode, ok, _body } = await requester.delete(`/api/messages/${messageId}`);
            
            expect(statusCode).to.be.equals(200);
        });

    });

});


