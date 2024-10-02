import * as chai from 'chai'; // Importar chai usando importación global para ES modules
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserDao from '../src/dao/userDao.js';

dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const expect = chai.expect;
const dao = new UserDao();
const testUser = { first_name: 'Juan', last_name: 'Tomaselli', age: '33', email: 'Juan@cielo.com', password: '123' };

describe('Tests DAO Users', function () {
    let testUserId;

    before(function () { });
    beforeEach(function () { });
    after(function () { });
    afterEach(function () { });

    it('get() debe retornar un array de usuarios', async function () {
        const result = await dao.getAllUser();
        expect(result).to.be.an('array');
        expect(result).to.be.deep.equal([]);
    });

    it('create() debe crear un Usuario correctamente', async function () {
        const result = await dao.createUser(testUser);

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
        expect(result._id).to.be.an.instanceOf(mongoose.Types.ObjectId);

        testUserId = result._id
    });

    it('getByID() debe ser capaz de buscar un CV por ID', async function () {
        const result = await dao.getUserById(testUserId);

        expect(result).to.be.an('object');
        expect(result._id).to.be.not.null;
    });

    it('put() debe retornar un objeto con datos correctamente modificados', async function () {
        const updatedData = { first_name: 'Juan Actualizado' };
        const result = await dao.updateUser(testUserId, updatedData);

        expect(result).to.be.an('object');
        // Buscar el usuario actualizado en la base de datos para verificar los cambios
        const updatedUser = await dao.getUserById(testUserId);

        // Comparar los datos actualizados
        expect(updatedUser.first_name).to.equal(updatedData.first_name)
    });

    it('deleteUser() debe eliminar el usuario correctamente', async function () {
        const result = await dao.deleteUser(testUserId);
        expect(result).to.be.an('object');

        // Verificar que el usuario fue eliminado
        const deletedUser = await dao.getUserById(testUserId);
        expect(deletedUser).to.be.null;
    });

});
