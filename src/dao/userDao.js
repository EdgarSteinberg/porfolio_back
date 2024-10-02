import userModel from '../models/usersModels.js';

class UserDao {

    async getAllUser() {
        return await userModel.find();
    }

    async getUserById(uid) {
        return await userModel.findOne({_id: uid});
    }

    async getUserByEmail(email) {
        return await userModel.findOne({ email });
    }

    async createUser(user) {
        return await userModel.create(user);
    }

    async updateUser(uid, update) {
        return await userModel.updateOne({_id: uid}, update);
    }

    async deleteUser(uid){
        return await userModel.deleteOne({_id: uid})
    }

}

export default UserDao