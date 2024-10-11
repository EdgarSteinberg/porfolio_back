import { Router } from 'express';
import aboutmeController from '../controllers/aboutmeController.js';
import { uploader } from '../utils/multer.js';
import sharp from 'sharp';
import path from 'path';
import __dirname from '../utils/constants.js';

const AboutmeController = new aboutmeController()
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await AboutmeController.getAboutme();
        res.send({ status: 'success', payload: result });
    } catch {
        res.status(400).send({ status: 'error', error: 'error' });
    }
});

router.get('/:aid', async (req, res) => {
    const { aid } = req.params;
    try {
        const result = await AboutmeController.getAboutmeById(aid);
        res.send({ status: 'success', payload: result });
    } catch {
        res.status(400).send({ status: 'error', error: 'error' });
    }
});

/* router.post('/', uploader.fields([
    { name: 'certificates', maxCount: 6 },  // Campo para certificados
    { name: 'skills_frontend', maxCount: 20 },  // Campo para habilidades frontend
    { name: 'skills_backend', maxCount: 20 },  // Campo para habilidades backend
    { name: 'skills_tools', maxCount: 20 },  // Campo para herramientas
    { name: 'image', maxCount: 6 } // Campo para imagen principal
]),
    async (req, res) => {
        try {
            // Certificados
            const certificates = req.files['certificates'] ? req.files['certificates'].map(file => file.filename) : [];

            // Skills Frontend
            const skills_frontend = req.files['skills_frontend'] ? req.files['skills_frontend'].map((file, index) => ({
                title: req.body[`frontend_title_${index}`],  // Título correspondiente al archivo
                image: file.filename
            })) : [];

            // Skills Backend
            const skills_backend = req.files['skills_backend'] ? req.files['skills_backend'].map((file, index) => ({
                title: req.body[`backend_title_${index}`],
                image: file.filename
            })) : [];

            // Tools
            const skills_tools = req.files['skills_tools'] ? req.files['skills_tools'].map((file, index) => ({
                title: req.body[`tools_title_${index}`],
                image: file.filename
            })) : [];

            // Imagen principal
            const image = req.files['image'] ? req.files['image'].map(file => file.filename) : [];

            const { description } = req.body;

            if (!description) {
                throw new Error('Debes completar todos los campos');
            }

            // Crear el objeto "skills" con las subcategorías frontend, backend y tools
            const skills = {
                frontend: skills_frontend,
                backend: skills_backend,
                tools: skills_tools
            };

            const result = await AboutmeController.createAboutme({ image, description, skills, certificates });
            res.send({ status: 'success', payload: result });
        } catch (error) {
            res.status(400).send({ status: 'error', error: error.message });
        }
    });
 */
router.post('/', uploader.fields([
    { name: 'certificates', maxCount: 6 },
    { name: 'skills_frontend', maxCount: 20 },
    { name: 'skills_backend', maxCount: 20 },
    { name: 'skills_tools', maxCount: 20 },
    { name: 'image', maxCount: 6 }
]), async (req, res) => {
    try {
        // Función para comprimir imagen
        const compressImage = async (filePath) => {
            const outputFile = `compressed_${filePath}`; // Cambia el nombre para la imagen comprimida
            const inputPath = path.join(__dirname, 'uploads', filePath); // Ruta de entrada
            const outputPath = path.join(__dirname, 'public', 'skills', outputFile); // Ruta de salida
        
            await sharp(inputPath)
                .resize(800) // Cambiar el tamaño a un ancho de 800px
                .jpeg({ quality: 80 }) // Comprimir con calidad del 80%
                .toFile(outputPath); // Guardar en la ruta de salida
        
            return outputFile; // Puedes devolver la ruta de la imagen comprimida si es necesario
        };

        // Procesar certificados
        const certificates = req.files['certificates']
            ? await Promise.all(req.files['certificates'].map(file => compressImage(file.filename)))
            : [];

        // Procesar skills frontend
        const skills_frontend = req.files['skills_frontend']
            ? await Promise.all(req.files['skills_frontend'].map(async (file, index) => ({
                title: req.body[`frontend_title_${index}`],
                image: await compressImage(file.filename)
            })))
            : [];

        // Procesar skills backend
        const skills_backend = req.files['skills_backend']
            ? await Promise.all(req.files['skills_backend'].map(async (file, index) => ({
                title: req.body[`backend_title_${index}`],
                image: await compressImage(file.filename)
            })))
            : [];

        // Procesar tools
        const skills_tools = req.files['skills_tools']
            ? await Promise.all(req.files['skills_tools'].map(async (file, index) => ({
                title: req.body[`tools_title_${index}`],
                image: await compressImage(file.filename)
            })))
            : [];

        // Procesar imagen principal
        const image = req.files['image']
            ? await Promise.all(req.files['image'].map(file => compressImage(file.filename)))
            : [];

        const { description } = req.body;
        if (!description) {
            throw new Error('Debes completar todos los campos');
        }

        const skills = { frontend: skills_frontend, backend: skills_backend, tools: skills_tools };
        const result = await AboutmeController.createAboutme({ image, description, skills, certificates });

        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.put('/:aid', uploader.array('skills', 10), async (req, res) => {
    const { aid } = req.params;
    const files = req.files; // Archivos cargados
    const { description, certificates } = req.body; // Otros datos

    try {

        // Procesar los archivos y agregar sus nombres al campo skills
        const skills = files ? files.map(file => file.filename) : [];

        const update = {
            ...(description && { description }),
            ...(certificates && { certificates }),
            ...(skills.length > 0 && { skills }) // Solo agregar si hay imágenes
        };

        const result = await AboutmeController.updateAboutme(aid, update);
        if (!result) throw new Error(`Error al actualizar el aboutme`);

        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});


router.delete('/:aid', async (req, res) => {
    const { aid } = req.params;
    try {
        const result = await AboutmeController.deleteAboutme(aid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'error' });
    }
});

export default router;