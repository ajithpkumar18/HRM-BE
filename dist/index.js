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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const hrDash_1 = __importDefault(require("./routes/hrDash"));
const auth_1 = require("./middlewares/auth");
const models_1 = require("./schema/models");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./controllers/user");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
// {   
//     "username": "roman",
//     "email":"roman@gmail.com",
//     "password": "eQewqd1esz@"
//  }
const passwordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');
const emailSchema = zod_1.z.string().email('Invalid email address');
const nameSchema = zod_1.z.string().min(3, 'Name is required').max(50, 'Name must be less than 50 characters');
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (err) {
        console.log(err);
    }
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/v1", hrDash_1.default);
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newUser = yield models_1.User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
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
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const newUser = new models_1.User({
            username: username,
            email: email,
            password: hashed,
            isAdmin: false
        });
        const savedUser = yield newUser.save();
        res.status(200).json({ message: "User created successfully" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating user" });
    }
}));
app.post("/logout", (req, res) => {
    res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "strict" }).status(200).json({ message: "Logout successful" });
    return;
});
app.get("/users", auth_1.authMiddleware, user_1.getUser);
app.get("/leads", (req, res) => {
    const userId = req.params;
    const user = { id: userId, name: "John Doe" };
    res.json(user);
});
app.listen(3000, () => {
    main();
    console.log('Server is running on port 3000');
});
