import mongoose from 'mongoose';

const messageCollection = 'messages';

const messageSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
})

const messageModel = mongoose.model(messageCollection, messageSchema);

export default messageModel;