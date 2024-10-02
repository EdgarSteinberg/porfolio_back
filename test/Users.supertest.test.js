import * as chai from 'chai'; // Importar chai usando importación global para ES modules
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
const testUser = { first_name: 'Juan', last_name: 'Tomaselli', age: '33', email: 'Juan@cielo.com', password: '123' };
let cookie;

describe('Tests itengracion Users', function () {
    describe('Tests Users', function () {
        before(function () { });
        beforeEach(function () { });
        after(function () { });
        afterEach(function () { });

        it('POST /api/users/register debe registrar un nuevo usuario ', async function () {
            const { _body, ok, statusCode } = await requester.post('/api/users/register').send(testUser);

            expect(_body.payload).to.be.ok;
            expect(statusCode).to.be.equals(200);
        });

        it('POST /api/users/register si el usuario esta registrado debe devolver un 400 ', async function () {
            const { _body, ok, statusCode } = await requester.post('/api/users/register').send(testUser);

            expect(statusCode).to.be.equals(400);
        });


        it('POST /api/users/login debe logear  correctamente al usuario ', async function () {
            const result = await requester.post('/api/users/login').send(testUser);
            const cookieData = result.headers['set-cookie'][0];
            cookie = { name: cookieData.split('=')[0], value: cookieData.split('=')[1] };

            expect(cookieData).to.be.ok;
            expect(cookie.name).to.be.equals('rojoCookieToken');
            expect(cookie.value).to.be.ok;
        });

        it('GET /api/users/current debe devolver datos correctos de usuario', async function () {
            const { _body, ok, statusCode } = await requester.get('/api/users/current').set('Cookie', [`${cookie.name}=${cookie.value}`]);
            
           // expect(_body).to.have.property('');
        });
    });

});