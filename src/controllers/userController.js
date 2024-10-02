import userModel from "../models/usersModels.js";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createHash, isValidadPassword } from "../utils/bcrypt.js";


import UserDao from "../dao/userDao.js";

const userDao = new UserDao();
dotenv.config()

const EMAIL = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
const SECRET_KEY = process.env.SECRET_KEY;

class UsersContoller {

    async getAllUsers() {
        try {
            return await userDao.getAllUser()
        } catch (error) {
            console.log('Error al obtener todos los usuarios', error);
            throw new Error('Error al obtener todos los usuarios');
        }
    }

    async getUser(uid) {
        try {
            const user = await userDao.getUserById(uid);
            if (!user) {
                throw new Error('Usuario no encontrado'); // Maneja el caso de usuario no encontrado
            }
            return user;
        } catch (error) {
            console.log('Error al obtener el usuario', error);
            throw new Error('Error al obtener el usuario'); // Mantén el mensaje genérico para evitar fugas de información
        }
    }
    

    async register(user) {
        const { first_name, last_name, age, email, password } = user

        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error('Error al crear el usuario: Todos los campos son obligatorios!');   
        }

        try {
            const existUser = await userDao.getUserByEmail(email); // Busca por email
            if (existUser) {
                throw new Error('Error: El correo electrónico ya está registrado');
            }
            // Hashear la contraseña antes de guardarla
            const hashedPassword = createHash(password);

            await userDao.createUser({ first_name, last_name, age, email, password: hashedPassword })

            return "Usuario creado correctamente!"
        } catch (error) {
            console.log('Error al crear el usuario', error);
            throw new Error('Error al crear el usuario');
        }
    }

    async login(email, password) {

        if (!email || !password) {
            throw new Error("Credenciales invalidas")
        }
        try {
            const user = await userDao.getUserByEmail(email);

            if (!user) {
                throw new Error("Email o contraseña incorrectos");
            }

            if (!isValidadPassword(user, password)) {
                throw new Error('Email o contraseña incorrectos');
            }
            return { message: 'Inicio de sesión exitoso', user };
        } catch (error) {
            console.log('Email o Password Incorrectos!');
            throw new Error(error.message)
        }
    }

 
    async updateUser(uid, update) {
        try {
            const updatedUser = await userDao.updateUser(uid,update);
            return updatedUser;
        } catch (error) {
            console.log(`El ID : ${uid} no encontrado`, error.message);
            throw new Error(`Error al actualizar el usuario`, error.message)
        }
    }

    async deleteUser(uid){
        try{
            const result = await userDao.deleteUser(uid)
            return result
        }catch (error){
            console.log(`Error al elimnar el usuario, usuario ID: ${uid} no encontrado`, error.message)
            throw new Error(`Error al eliiminar el usuario`, error.meesage);
        }
    }

    async sendEmailPasswordReset(email) {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASS
            }
        });

        const user = await userDao.getUserByEmail(email);
        if (!user) {
            throw new Error('Correo electronico no encontrado')
        }

        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
        console.log(`Este el token desde el email`, token);

        await transport.sendMail({
            from: 'Edgar Steinberg <s.steinberg2019@gmail.com>',
            to: email,
            subject: 'Recuperacion de contraseña',
            html: `<div style="font-family: Arial, sans-serif; color: #333;">
            <h1>Solicitud de Recuperación de Contraseña</h1>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, por favor ignora este correo.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="https://porfolio-frontend.onrender.com/reset-password?token=${token}">
            <button class="btnChat">Restablecer Contraseña</button>
            </a>
            <p>Este enlace es válido por 1 hora.</p>
            <p>Gracias,</p>
            <p>El equipo de soporte de PorfolioEdgar</p>
          </div>`
        });

        return token;
    }

    async resetPassword(token, newPassword) {
        try {
            const data = jwt.verify(token, SECRET_KEY);
            const { email } = data;
            const user = await userDao.getUserByEmail(email);

            if (!user) {
                throw new Error('Correo electronico no encontrado');
            }
            if (isValidadPassword(user, newPassword)) {
                throw new Error('La nueva contraseña no puede ser la misma que la anterior');
            }
            const hashedPassword = await createHash(newPassword);
            await userDao.updateUser(user._id, { password: hashedPassword });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new Error('El enlace ha expirado. Por favor, solicita un nuevo enlace de restablecimiento de contraseña.');
            } else {
                throw error;
            }
        }
    }
}

export default UsersContoller;