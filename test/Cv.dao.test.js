import CvDao from "../src/dao/cvDao.js";
import Assert from 'assert';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

const dao = new CvDao();
const assert = Assert.strict;
const testCv = {
    empresa: 'empresaCv',
    fechaInicio: new Date('2024-09-20'), // Fechas en formato Date
    fechaFin: new Date('2024-11-30'),
    puesto: 'Tester',
    descripcionTareas: 'Pruebas Unitarias',
    tecnologias: ['Mocha', 'Chai'] // Tecnologías como array
};

describe('Tests DAO Cv', function () {
    let createdCvId;  // Variable para almacenar el ID del CV creado

    // Se ejecuta ANTES de comenzar el paquete de tests
    before(function () { });

    // Se ejecuta ANTES de CADA test
    beforeEach(function () {
        // Vaciando la colección cv_tests
        // mongoose.connection.collections.cv_tests.drop();
        // this.timeout(3000);
    });

    // Se ejecuta FINALIZADO el paquete de tests
    after(function () { });

    afterEach(function () { });

    it('get() debe retornar un array con el CV', async function () {
        const result = await dao.getAllcv();
        assert.strictEqual(Array.isArray(result), true);
    });

    it('create() debe crear un CV correctamente', async function () {
        const result = await dao.createCv(testCv);
        assert.strictEqual(typeof result, 'object');
        assert.ok(result._id);

        // Guardar el ID creado para usarlo más tarde
        createdCvId = result._id;
    });

    it('getByID() debe ser capaz de buscar un CV por ID', async function () {
        // Luego buscarlo por su _id
        const result = await dao.getCvById(createdCvId);  // Búsqueda por _id

        // Verificaciones
        assert.strictEqual(typeof result, 'object');
        assert.ok(result._id);
        assert.strictEqual(result.empresa, testCv.empresa);
    });

    it('put() debe retornar un objeto con datos correctamente modificados', async function () {
        // Luego actualizamos el campo "empresa"
        const updatedCv = 'EdgarFreeLancer'
        const result = await dao.updateCv(createdCvId, { empresa: 'EdgarFreeLancer' });

        // Comprobamos el resultado
        assert.strictEqual(typeof result, 'object');
        assert.ok(result._id);
        assert.strictEqual(result.empresa, updatedCv);  // Aquí comprobamos el valor actualizado
    });

    it('delete() debe eliminar el documento indicado', async function () {
        
        const result = await dao.deleteCv(createdCvId);

        assert.strictEqual(typeof result, 'object');
        assert.strictEqual(result.deletedCount, 1); 
    });
});
