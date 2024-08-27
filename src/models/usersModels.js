import mongoose from 'mongoose';

const userCollection = 'Users'

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String,unique: true, required: true },
    password: { type: String, required: true }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;