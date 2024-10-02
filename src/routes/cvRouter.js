import { Router } from 'express';
import cvController from '../controllers/cvController.js';

const CVcontroller = new cvController();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await CVcontroller.getCv();
        res.send({ status: 'success', payload: result });
    } catch (error){
        res.status(500).send({ status: 'error', error: 'Error al obtener CVs' });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;  
    try {
        const result = await CVcontroller.getCvById(cid);

        res.send({ status: 'success', payload: result });
    } catch (error){
        res.status(500).send({ status: 'error', error: `El ID: ${cid} no existe` });
    }
});

router.post('/', async (req, res) => {
    const { empresa, fechaInicio, fechaFin, puesto, descripcionTareas,tecnologias } = req.body;
    try {
        if (!empresa || !fechaInicio || !puesto || !descripcionTareas) throw new Error(`Debes completar todos los campos requeridos`);

        const result = await CVcontroller.createCv({ empresa, fechaInicio, fechaFin, puesto, descripcionTareas,tecnologias });

        res.send({ status: 'success', payload: result });
    } catch (error){
        res.status(500).send({ status: 'error', error: 'Error al crear el CV' });
    }
});

router.put('/:cid', async (req, res) => { 
    const { cid } = req.params; 
    const update = req.body;
    try {
    
        const result = await CVcontroller.updateCv(cid, update);

        res.send({ status: 'success', payload: result });
    } catch (error){
        res.status(500).send({ status: 'error', error: 'Error al actualizar el CV' });
    }
});

router.delete('/:cid', async (req, res) => { 
    const { cid } = req.params;
    try {
        const result = await CVcontroller.deleteCv(cid);
        res.send({ status: 'success', payload: result });
    } catch (error){
        res.status(500).send({ status: 'error', error: 'Error al eliminar el CV' });
    }
});

export default router;
