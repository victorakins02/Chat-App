import express, { request, response } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/User.mjs';
import cors from 'cors';



dotenv.config();

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

const jwtSecret = process.env.JWT_SECRET;

const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));



const PORT = process.env.PORT || 4000;

app.get('/test',(request, response) =>{
    response.json('test ok')
});

app.post('/register', async (request, response) => {
    const {username, password} = request.body;
    try{
        const createdUser = await User.create({username, password});
        jwt.sign({userId:createdUser._id}, jwtSecret, {} ,(err, token) => {
            if (err) throw err;
            response.cookie('token', token).status(201).json('ok');
        });
    } catch (err) {
        console.error(err); // Log the error for debugging
        response.status(500).json('An error occurred during registration.');
    }  
})

app.listen(PORT, () =>{
    //console.log(`Running on Port ${PORT}`)
})
