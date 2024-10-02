import messageModel from "../models/messageModel.js";

class MessageDao {
    
    async getAllMessage() {
        return await messageModel.find();
    }

    async getMessageById(mid) {
        return await messageModel.findOne({ _id: mid });
    }

    async createMessage(message) {
        return await messageModel.create(message);
    }

    async messageUpdate(mid, update){
        return await messageModel.findOneAndUpdate({_id: mid}, update ,{new: true});
    }

    async deleteMessage(mid) {
        return await messageModel.deleteOne({ _id: mid });
    }
}

export default MessageDao;