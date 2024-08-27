import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import proyectRouter from './routes/proyectsRouter.js';

dotenv.config();
const app = express();

const uri = process.env.MONGODB_URI;
mongoose.connect(uri);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/users', userRouter);
app.use('/messages', messageRouter);
app.use('/proyects', proyectRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server start in PORT http://localhost:${PORT}`);
});