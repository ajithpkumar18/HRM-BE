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
const hrDash_1 = __importDefault(require("./routes/hrDash"));
const auth_1 = require("./middlewares/auth");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("./controllers/user");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_2 = require("./controllers/auth");
dotenv_1.default.config();
// {   
//     "username": "roman",
//     "email":"roman@gmail.com",
//     "password": "eQewqd1esz@"
//  }
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
app.use("/hr", hrDash_1.default);
app.post('/signin', auth_2.SignIn);
app.post('/signup', auth_2.SignUp);
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
