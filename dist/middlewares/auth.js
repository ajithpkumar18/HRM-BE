"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const token = req.cookies.access_token;
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        next();
    }
    else {
        let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decoded, "decoded);");
        if (!decoded) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        else {
            console.log(decoded, "decoded");
            if (!req.body)
                req.body = {};
            req.isAdmin = decoded.isAdmin;
            req.id = decoded.id;
            console.log(req.isAdmin, "is admin");
            console.log(req.id, "id");
            next();
        }
    }
}
