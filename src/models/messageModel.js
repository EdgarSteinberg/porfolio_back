import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const messageCollection = process.env.DB_COLLECTION || 'messages';

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
})

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;