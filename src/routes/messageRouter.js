import { Router } from 'express'
import Message from '../controllers/messageController.js';

const MessageController = new Message();
const router = Router()

router.get('/', async (req, res) => {
    try {
        const result = await MessageController.getAllMessages()
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.send({ status: 'error', error: 'Error al obtener los mensajes' });
    }
});

router.get('/:mid', async (req, res) => {
    const { mid } = req.params;
    try {
        const result = await MessageController.getMessageById(mid);
        res.send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message });
    }
});

router.post('/', async (req, res) => {
    const { email, message, name } = req.body;
    try {

        if (!email || !message || !name) {
            return res.status(400).send({ status: 'error', error: 'El email y el mensaje son obligatorios' });
        }

        const result = await MessageController.createMessage({ email, message, name });
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: 'Error al crear los mensajes' });
    }
});

router.put('/:mid', async (req, res) => {
    const { mid } = req.params;
    const update = req.body
    try {
        if (!mid) {
            return res.status(400).send({ status: 'error', error: error.message });
        }

        const result = await MessageController.messageUpdate(mid, update);
        res.send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message })
    }
});

router.delete('/:mid', async (req, res) => {
    const { mid } = req.params;
    try {
        const result = await MessageController.deleteMessage(mid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(500).send({ status: 'error', error: 'error' })
    }
})
export default router;