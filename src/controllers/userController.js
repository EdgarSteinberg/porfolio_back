import userModel from "../models/usersModels.js";
import { createHash, isValidadPassword } from "../utils/bcrypt.js";

class UsersContoller {

    async getAllUsers() {
        try {
            return await userModel.find()
        } catch (error) {
            console.log('Error al obtener todos los usuarios', error);
            throw new Error('Error al obtener todos los usuarios');
        }
    }

    async getUser(uid) {
        try {
            return await userModel.findOne({ _id: uid });
        } catch (error) {
            console.log('Error al obtener el usuario', error);
            throw new Error('Error al obtener el usuario');
        }
    }

    async register(user) {
        const { first_name, last_name, age, email, password } = user

        if (!first_name || !last_name || !age || !email || !password) {
            throw new Error('Error al crear el usuario: Todos los campos son obligatorios!');
        }

        try {
            // Hashear la contraseña antes de guardarla
            const hashedPassword = createHash(password);

            await userModel.create({ first_name, last_name, age, email, password: hashedPassword })

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
            const user = await userModel.findOne({ email });

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
}

export default UsersContoller;