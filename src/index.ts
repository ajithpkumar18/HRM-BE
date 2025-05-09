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


dotenv.config();

// {   
//     "username": "roman",
//     "email":"roman@gmail.com",
//     "password": "eQewqd1esz@"
//  }




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

app.use(express.json());
app.use(cookieParser())

app.use("/hr", hrRouter)

app.post('/signin', SignIn);

app.post('/signup', SignUp)

app.post("/logout", (req, res) => {
    res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "strict" }).status(200).json({ message: "Logout successful" })
    return;
})

app.get("/users", authMiddleware, getUser)

app.get("/leads", (req, res) => {
    const userId = req.params;
    const user = { id: userId, name: "John Doe" };
    res.json(user);
})

app.listen(3000, () => {
    main();
    console.log('Server is running on port 3000');
})
