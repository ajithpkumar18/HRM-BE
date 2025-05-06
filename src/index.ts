import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import hrRouter from "./routes/hrDash";
import { authMiddleware } from "./middlewares/auth";

import { z } from 'zod';

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: passwordSchema
});

const app = express();

app.use(express.json());

app.use("/v1", hrRouter)

app.post('/signin', (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const passwordValidationResult = passwordSchema.safeParse(password);

    if (!passwordValidationResult.success) {
        res.status(400).json({ error: passwordValidationResult.error.format() });
        return
    }
    else {
        res.status(200).json({ message: "Password is valid" });
        return
    }
    console.log(username, password);
    // bcrypt.hash(password, 10, (err, hash) => {
    //     if (err) {
    //         console.log
    //             (err);
    //     }
    //     res.json({ hash: hash });
    // });
});

app.post('/signup', (req, res) => {
    const data = req.body.hash;
    const password = req.body.password;

    bcrypt.compare(password, data, (err, result) => {
        res.json({ ans: result });
    })
})

app.post("/logout", (res, req) => {
    const data = req;
})

app.get("/users", (req, res) => {
    const users = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Doe" },
    ];
    res.json(users);
})

app.get("/leads", (req, res) => {
    const userId = req.params;
    const user = { id: userId, name: "John Doe" };
    res.json(user);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
