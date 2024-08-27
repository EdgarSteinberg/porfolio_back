import { Router } from 'express'
import Message from '../controllers/messageController.js';

const MessageController = new Message();
const router = Router()

router.get('/', async (req,res) => {
    try{
        const result = await MessageController.getAllMessages()
        res.send({status: 'success', payload: result});
    }catch{
        res.send({status: 'error', error: 'Error al obtener los mensajes'});
    }
});

router.post('/', async (req,res) => {
    try{
        const {email, message, name} = req.body;

        if (!email || !message || !name) {
            return res.status(400).send({ status: 'error', error: 'El email y el mensaje son obligatorios' });
        }

        const result = await MessageController.CreateMessage({email,message, name});
        res.send({status: 'success', payload: result});
    }catch{
        res.send({status: 'error', error: 'Error al crear los mensajes'});
    }
});

export default router;