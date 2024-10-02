import MessageDao from "../dao/messageDao.js";

const messageDao = new MessageDao();

class MessageController {

    async getAllMessages() {
        try {
            return await messageDao.getAllMessage();
        } catch (error) {
            console.error('Error al obtener los mensajes:', error.message);
            throw new Error('Error al obtener los mensajes');
        }
    }

    async getMessageById(mid) {
        if (!mid) {
            throw new Error('ID del mensaje es requerido');
        }
        try {
            const message = await messageDao.getMessageById(mid);
            if (!message) {
                throw new Error('Mensaje no encontrado');
            }
            return message;
        } catch (error) {
            console.error('Error al obtener el mensaje:', error.message);
            throw new Error(`Error al obtener los mensajes ${error.message}`);
        }
    }
    async createMessage(userData) {
        const { message, email, name } = userData;

        if (!message || !email || !name) {
            throw new Error('Debes completar todos los campos del mensaje');
        }

        try {
            const result = await messageDao.createMessage({ message, email, name });
            return result;
        } catch (error) {
            console.error('Error al crear el mensaje:', error.message);
            throw new Error(`Error al crear el mensaje ${error.message}`);
        }
    }

    async messageUpdate(mid, update) {
        if (!mid) {
            throw new Error(`El ID proporcionado no es válido`);
        }

        try {
            const result = await messageDao.messageUpdate(mid, update);
            return result;
        } catch (error) {
            console.error(`Error al actualizar el mensaje`, error.message);
            throw new Error(`Error al actualizar el mensaje ${error.message}`)
        }
    }

    async deleteMessage(mid) {
        if (!mid) {
            throw new Error('ID del mensaje es requerido');
        }

        try {
            const result = await messageDao.deleteMessage(mid);
            return result;
        } catch (error) {
            console.error('Error al eliminar el mensaje:', error.message);
            throw new Error(`Error al eliminar el mesaje ${error.message}`);
        }
    }
}

export default MessageController;
