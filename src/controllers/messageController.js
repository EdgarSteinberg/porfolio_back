import messageModel from "../models/messageModel.js";

class MessageController{

    async getAllMessages(){
        try{
            return await messageModel.find();
          
        }catch(error){
            console.log('Error al obtener los mensajes', error);
            throw new Error(`Error al obtener los mensajes`);
        }
    };

    async CreateMessage(userData) {
        const {message, email, name} = userData

        if(!message || !email || !name)  throw new Error `Debes completar el mensaje`;
        try{
            const result = await messageModel.create({message, email, name});
            return result;
        } catch(error){
                console.log('Error al crear mensajes');
                throw new Error(`Error al crear los mensajes`, error);
            }
        }
    };

export default MessageController;