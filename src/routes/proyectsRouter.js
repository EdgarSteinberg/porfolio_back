import { Router } from 'express';
import Proyects from '../controllers/proyectsController.js';
import { uploader } from '../utils/multer.js';

const ProyectsController = new Proyects();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await ProyectsController.getAllProyects();
        res.send({ status: 'success', payload: result });
    } catch {
        res.send({ status: 'error', error: 'Error al obtener los proyectos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const result = await ProyectsController.getAllProyectById(pid);
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({ status: 'success', payload: result });
    } catch {
        res.send({ status: 'error', error: 'Proyecto no encontrado' });
    }
});

router.post('/', uploader.array('thumbnails', 3), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No se subió ningún archivo.');
    }

    try {
        const { title, description, url } = req.body;

        if (!title || !description || !url) {
            res.send({ status: 'error', error: 'Debes llenar todos los campos' });
        }

        // Procesa los archivos subidos (aquí estoy asumiendo que quieres usar la primera imagen como 'thumbnail')
        const thumbnail = req.files.map(file => file.path); // Obtener la ruta de los archivos subidos

        const result = await ProyectsController.createProyect({ title, description, url, thumbnail });

        res.send({ status: 'success', payload: result });
    } catch {
        res.status(500).send({ status: 'error', error: 'Error al crear el proyecto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updates  = req.body;

        const result = await ProyectsController.updateProyect( pid, updates );
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({status: 'success', payload: result});
    }catch{
        res.send({status: 'error', error: 'Error al actualizar el producto'});
    }
});

router.delete('/:pid', async (req, res) => {
    try{
        const {pid} = req.params;
        const result = await ProyectsController.deleteProyect(pid);
        if (!result) {
            return res.send({ status: 'error', error: 'Proyecto no encontrado' });
        }
        res.send({status: 'success', payload: result});
    }catch{
        res.send({status: 'error', error: 'Error al eliminar el proyecto'});
    }
});

export default router;