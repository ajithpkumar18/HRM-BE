import { Request, Response } from "express";
import z from "zod";
import { User } from "../schema/UserModels";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

const emailSchema = z.string().email('Invalid email address');
const nameSchema = z.string().min(3, 'Name is required').max(50, 'Name must be less than 50 characters');

export const SignIn = async (req: Request, res: Response) => {

    const identifier = req.body.identifier;
    const password = req.body.password;

    const passwordValidationResult = passwordSchema.safeParse(password);
    const identifierIsEmail = identifier.includes("@") && identifier.includes(".") && identifier.length > 5;
    const identifierValidationResult = identifierIsEmail ? emailSchema.safeParse(identifier) : nameSchema.safeParse(identifier);

    if (!passwordValidationResult.success || !identifierValidationResult.success) {
        res.status(400).json({ "message": "Invalid Input" });
        return;
    }
    console.log(passwordValidationResult.success, identifierValidationResult.success, "Sign in endpoint")

    try {

        const newUser = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        console.log(identifier, password, newUser)
        if (!newUser) {
            res.status(400).json({ message: "User not found" });
            return;
        }

        if (!newUser.password) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        const isMatch = await bcrypt.compare(password, newUser.password);
        console.log(newUser, isMatch);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        let token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 1000
        }).status(200).json({ id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: newUser.isAdmin });
        return;

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in" });
    }

}

export const SignUp = async (req: Request, res: Response) => {
    console.log("signup");

    const { username, email, password, role } = req.body;

    const passwordValidationResult = passwordSchema.safeParse(password);
    const emailValidationResult = emailSchema.safeParse(email);
    const nameValidationResult = nameSchema.safeParse(username);

    if (!passwordValidationResult.success || !emailValidationResult.success || !nameValidationResult.success) {
        res.status(400).json({
            message: "Invalid Input", errors: {
                password: passwordValidationResult.error?.issues,
                email: emailValidationResult.error?.issues,
                username: nameValidationResult.error?.issues
            }
        });
        return;
    }

    const validRoles = ["HR", "Admin", "Employee"];
    if (!role || !validRoles.includes(role)) {
        res.status(400).json({ message: "Invalid role. Allowed roles are HR, Admin, Employee." });
        return;
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(400).json({ message: "Email or username already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            isAdmin: role === "Admin"
        });


        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully", user: { id: savedUser._id, username: savedUser.username, email: savedUser.email, role: savedUser.role } });
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Error creating user" });
    }
};