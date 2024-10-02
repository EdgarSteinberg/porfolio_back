import { Router } from 'express';
import Proyects from '../controllers/proyectsController.js';
import { uploader } from '../utils/multer.js';

const ProyectsController = new Proyects();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await ProyectsController.getAllProyects();
        res.send({ status: 'success', payload: result });
    } catch (error){
        res.send({ status: 'error', error: 'Error al obtener los proyectos' });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await ProyectsController.getAllProyectById(pid);
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({ status: 'success', payload: result });
    } catch (error){
        res.send({ status: 'error', error: 'Proyecto no encontrado' });
    }
});

// Ruta para crear un proyecto con ambos uploaders
router.post(
    '/',
    uploader.fields([
        { name: 'thumbnail', maxCount: 3 },  // Campo para thumbnails
        { name: 'technologies', maxCount: 5 } // Campo para tecnologías
    ]),
    async (req, res) => {
        try {
            // Manejo de thumbnails
            const thumbnails = req.files['thumbnail'] ? req.files['thumbnail'].map(file => file.filename) : [];

            // Manejo de imágenes de tecnologías
            const technologies = req.files['technologies'] ? req.files['technologies'].map(file => file.filename) : [];

            const { title, description, url } = req.body;

            if (!title || !description || !url) {
                return res.status(400).send({ status: 'error', error: 'Debes llenar todos los campos' });
            }

            const result = await ProyectsController.createProyect({ title, description, url, thumbnail: thumbnails, technologies });

            res.send({ status: 'success', payload: result });
        } catch (error) {
            console.error(err);
            res.status(400).send({ status: 'error', error: error.message });
        }
    }
);


router.put('/:pid', uploader.fields([
    { name: 'thumbnail', maxCount: 1 }, // Solo se permite un archivo para thumbnails
    { name: 'technologies', maxCount: 5 } // Se permiten hasta 5 archivos para tecnologías
]), async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    try {

        // Manejo de archivos en la solicitud
        if (req.files) {
            // Procesa los thumbnails
            if (req.files['thumbnail']) {
                updates.thumbnail = req.files['thumbnail'].map(file => file.filename); // Guarda solo los nombres de los archivos
            }

            // Procesa las tecnologías
            if (req.files['technologies']) {
                updates.technologies = req.files['technologies'].map(file => file.filename); // Guarda solo los nombres de los archivos
            }
        }

        const result = await ProyectsController.updateProyect(pid, updates);
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({ status: 'success', payload: result });
    } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
        res.send({ status: 'error', error: 'Error al actualizar el proyecto' });
    }
});
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await ProyectsController.deleteProyect(pid);
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({ status: 'success', payload: result });
    } catch (error){
        res.send({ status: 'error', error: 'Error al eliminar el proyecto' });
    }
});

export default router;