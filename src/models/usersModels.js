import mongoose from 'mongoose';

const userCollection = 'Users';
//const userCollection = 'Users_test';

const userSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['user', 'admin', 'premium'], default: 'user' }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;