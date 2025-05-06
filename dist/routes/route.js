"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/dashboard", auth_1.authMiddleware, (req, res, next) => {
    res.send("Hello World!");
});
