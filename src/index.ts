import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import hrRouter from "./routes/hrDash";
import { authMiddleware } from "./middlewares/auth";
import { User } from './schema/UserModels';
import { z } from 'zod';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { getUser } from './controllers/user';
import cookieParser from 'cookie-parser';
import { SignIn, SignUp } from './controllers/auth';
import cors from 'cors';


dotenv.config();


const main = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log(err);
    }
}

const app = express();
app
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use("/hr", hrRouter)

app.listen(3001, () => {
    main();
    console.log('Server is running on port 3001');
})
