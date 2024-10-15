import { Router } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

import Users from "../controllers/userController.js";

const userController = new Users();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await userController.getAllUsers()
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const result = await userController.getUser(uid);
        res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.post('/register', async (req, res, next) => {
    const { first_name, last_name, age, email, password } = req.body;
    try {

        if (!first_name || !last_name || !age || !email || !password) {
            return res.status(400).send({ status: 'error', error: 'Todos los campos son obligatorios' });

        }

        const result = await userController.register({ first_name, last_name, age, email, password });
        return res.status(200).send({ status: 'success', redirectUrl: 'https://edgar-steinberg-portfolio.netlify.app/login' });
        //res.send({ status: 'success', payload: result });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
        // next(error);  
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).send({ status: 'error', error: 'Email o Password incorrectos!' });
        }
        const result = await userController.login(email, password);

        if (!result) {
            return res.status(401).send({ status: 'error', error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ email: result.email, id: result._id }, 'rojoSecret', { expiresIn: '24h' });

        res.cookie('rojoCookieToken', token, {
            maxAge: 60 * 60 * 1000,  // 1 hora
            httpOnly: true,          // Evita acceso desde JavaScript en el cliente
            secure: true,            // Asegura que la cookie se envíe solo por HTTPS
            sameSite: 'None'         // Permite uso en diferentes dominios
        });

        // Luego se realiza el redireccionamiento
        return res.status(200).send({ status: 'success', redirectUrl: 'https://edgar-steinberg-portfolio.netlify.app/proyects' });
    } catch (error) {
        res.status(400).send({ status: 'error', error: error.message });
    }
});

router.get('/current', async (req, res) => {
    try {
        const cookie = req.cookies['rojoCookieToken'];
        if (!cookie) {
            return res.status(401).send({ status: 'error', error: 'No autenticado' });
        }

        const user = jwt.verify(cookie, SECRET_KEY);  // Asegúrate de tener acceso a SECRET_KEY
        res.send({ status: 'success', payload: user });
    } catch (error) {
        res.status(400).send({ status: 'error', message: 'Token inválido o expirado' });
    }
});

router.put('/:uid', async (req, res) => {
    const { uid } = req.params;
    const update = req.body

    if (!uid) {
        throw new Error(`El ID: ${uid} No existe`)
    }
    try {
        const result = await userController.updateUser(uid, update);
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message });
    }
})

router.delete('/:uid', async (req, res) => {
    const { uid } = req.params;
    if (!uid) {
        throw new Error(`El ID: ${uid} No existe`)
    }
    try {
        const result = await userController.deleteUser(uid)
        res.send({ status: 'success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'error', error: error.message })
    }
})

router.get("/reset-password", async (req, res) => {
    const { token } = req.query;
    console.log('Token recibido:', token);

    if (!token) {
        return res.status(400).send({ status: 'error', message: 'Token no proporcionado' });
    }

    try {
        res.status(200).send({ status: 'success', message: 'Token válido, muestra la página de restablecimiento de contraseña.' });
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al verificar el token.' });
    }
});

router.post('/recover-password', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).send({ status: 'error', message: 'Email no proporcionado' });
    }
    try {
        await userController.sendEmailPasswordReset(email);
        res.status(200).send({ status: 'success', message: 'Correo de recuperación enviado correctamente.' });
    } catch (error) {
        console.error('Error al enviar correo de recuperación:', error.message);
        res.status(500).send({ status: 'error', message: 'Error al enviar el correo de recuperación.' });
    }
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    console.log('Token recibido en el formulario', token, newPassword);

    if (!token || !newPassword) {
        return res.status(400).send({ status: 'error', message: 'Token o nueva contraseña no proporcionados' });
    }

    try {
        await userController.resetPassword(token, newPassword);
        // res.redirect('/check-email');
        res.status(200).send({ status: 'success', message: 'Contraseña restablecida correctamente.' });
    } catch (error) {
        console.error(error.message);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(400).send({ status: 'error', message: 'El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.' });
        } else {
            return res.status(500).send({ status: 'error', message: error.message });
        }
    }
});



export default router;

