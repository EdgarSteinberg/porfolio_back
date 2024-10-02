import { Router } from 'express';
import aboutmeController from '../controllers/aboutmeController.js';
import { uploader } from '../utils/multer.js';

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

router.post('/', uploader.fields([
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
    } catch (error){
        res.status(400).send({ status: 'error', error: 'error' });
    }
});

export default router;