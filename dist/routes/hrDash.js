"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const userDetails_1 = require("../controllers/userDetails");
const router = (0, express_1.Router)();
router.get("/dashboard", auth_1.authMiddleware);
router.get("/employees", auth_1.authMiddleware, userDetails_1.getUserDetails);
router.post("/employees", auth_1.authMiddleware, userDetails_1.postUserDetails);
router.put("/employee", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.get("/leads", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.post("/lead", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.put("/lead", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.get("/holdiays", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.post("/holidays", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
router.put("/holidays", auth_1.authMiddleware, (req, res) => {
    res.send("Hello World!");
});
exports.default = router;
