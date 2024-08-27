import { Router } from 'express';
import Users from "../controllers/userController.js";

const userController = new Users();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await userController.getAllUsers()
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: message.error });
    }
});

router.get('/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await userController.getUser(uid);
        res.send({ status: 'succes', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: message.error });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, age, email, password } = req.body;

        if (!first_name || !last_name || !age || !email || !password) {
            return res.status(400).send({ status: 'error', error: 'Todos los campos son obligatorios' });
        }

        const result = await userController.register({ first_name, last_name, age, email, password });
        res.send({ status: 'success', message: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: 'error', error: 'Email o Password incorrectos!' });
        }
        const result = await userController.login( email, password );
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

export default router;