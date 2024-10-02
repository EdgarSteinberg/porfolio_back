import * as chai from 'chai';
import supertest from 'supertest';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');
let aboutme;

describe('Test itengracion Aboutme', function () {
    describe('Tests Aboutme', function () {
        before(function () { });
        beforeEach(function () { });
        after(function () { });
        afterEach(function () { });

        it('POST debe crear un aboutme correctamente', async function () {
            const response = await requester.post('/api/aboutme')

                .field('description', 'Mi nombre es Edgar')
                .attach('certificates', './public/certificates/66c4ad4763352edb5a6ce6aa.png') // Ruta correcta para certificados
                .attach('skills_frontend', './public/skills/frontend/js_logo_transparente.png') // Archivo para habilidad frontend
                .attach('skills_backend', './public/skills/backend/jsnode_logo_transparente.png') // Archivo para habilidad backend
                .attach('skills_tools', './public/skills/tools/github_logo_transparente.png') // Archivo para herramientas
                .attach('image', './public/image/yo_transparente.png') // Imagen principal
                .field('frontend_title_0', 'React') // Título de la habilidad frontend
                .field('backend_title_0', 'Node.js') // Título de la habilidad backend
                .field('tools_title_0', 'Git') // Título de la herramienta
                .expect(200); // Esperamos un código de estado 200

            // Verificar la respuesta
            const { body } = response;
            expect(body.status).to.equal('success'); // Verificamos que la respuesta indique éxito
            expect(body.payload).to.have.property('_id'); // Verificamos que el documento tiene un ID

            // Validaciones adicionales para verificar que los archivos y datos fueron guardados correctamente
            expect(body.payload).to.have.property('description', 'Mi nombre es Edgar');
            expect(body.payload.image).to.be.an('array').that.includes('yo_transparente.png'); // Verificar la imagen principal
            expect(body.payload.skills.frontend[0].image).to.equal('js_logo_transparente.png'); // Verificar la imagen de frontend
            expect(body.payload.skills.backend[0].image).to.equal('jsnode_logo_transparente.png'); // Verificar la imagen de backend
            expect(body.payload.skills.tools[0].image).to.equal('github_logo_transparente.png'); // Verificar la imagen de tools
            expect(body.payload.certificates).to.include('66c4ad4763352edb5a6ce6aa.png'); // Verificar certificado

            aboutme = body.payload._id;
        });

        it('GET debe retornar todos los aboutme', async function () {
            const { body, ok, statusCode } = await requester.get('/api/aboutme');

            expect(statusCode).to.equal(200); // Verifica que el código de estado sea 200
            expect(body.payload).to.be.ok; // Verifica que el payload exista
            expect(body.payload).to.be.an('array'); // Verifica que el payload sea un array
        });

        it('GETBYID debe retornar un aboutme por ID', async function () {
            const { body, ok, statusCode } = await requester.get(`/api/aboutme/${aboutme}`);

            expect(statusCode).to.equal(200); // Verifica que el código de estado sea 200
            expect(body.payload).to.be.ok; // Verifica que el payload exista
            expect(body.payload).to.be.an('object');
        });

        it('DELETE debe eliminar un aboutme correctamente', async function () {
            const { body, ok, statusCode } = await requester.delete(`/api/aboutme/${aboutme}`);

            expect(statusCode).to.equal(200); // Verifica el código de estado de la eliminación
            expect(body.status).to.equal('success'); // Verifica que la respuesta indique éxito

            // Verifica que el aboutme ya no existe
            const verifyResponse = await requester.get(`/api/aboutme/${aboutme}`);
            expect(verifyResponse.status).to.equal(400); // O el código que uses para indicar que no se encontró
            expect(verifyResponse.body).to.have.property('error'); 
        });
    });
});
