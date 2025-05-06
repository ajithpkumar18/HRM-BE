"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}
