"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = exports.SignIn = void 0;
const zod_1 = __importDefault(require("zod"));
const UserModels_1 = require("../schema/UserModels");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passwordSchema = zod_1.default
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');
const emailSchema = zod_1.default.string().email('Invalid email address');
const nameSchema = zod_1.default.string().min(3, 'Name is required').max(50, 'Name must be less than 50 characters');
const SignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const identifier = req.body.identifier;
    const password = req.body.password;
    const passwordValidationResult = passwordSchema.safeParse(password);
    const identifierIsEmail = identifier.includes("@") && identifier.includes(".") && identifier.length > 5;
    const identifierValidationResult = identifierIsEmail ? emailSchema.safeParse(identifier) : nameSchema.safeParse(identifier);
    if (!passwordValidationResult.success || !identifierValidationResult.success) {
        res.status(400).json({ "message": "Invalid Input" });
        return;
    }
    try {
        const newUser = yield UserModels_1.User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
        if (!newUser) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, newUser.password);
        console.log(newUser, isMatch);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }
        let token = jsonwebtoken_1.default.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
        }).status(200).json({ message: "Login successful" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in" });
    }
});
exports.SignIn = SignIn;
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const passwordValidationResult = passwordSchema.safeParse(password);
    const emailValidationResult = emailSchema.safeParse(email);
    const nameValidationResult = nameSchema.safeParse(username);
    if (!passwordValidationResult.success || !emailValidationResult.success || !nameValidationResult.success) {
        res.status(400).json({ "message": "Invalid Input" });
        return;
    }
    try {
        const hashed = yield bcrypt_1.default.hash(password, 10);
        const newUser = new UserModels_1.User({
            username: username,
            email: email,
            password: hashed,
            isAdmin: false
        });
        const savedUser = yield newUser.save();
        res.status(200).json({ message: "User created successfully" });
        return;
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating user" });
        return;
    }
});
exports.SignUp = SignUp;
