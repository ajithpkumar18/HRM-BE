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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUserById = exports.getUser = void 0;
const models_1 = require("../schema/models");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield models_1.User.find().select("username isAdmin _id");
    if (!users) {
        res.status(404).json({ message: "No users found" });
        return;
    }
    console.log(req.isAdmin, "req.body");
    res.json(users);
    return;
});
exports.getUser = getUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield models_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield models_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (req.isAdmin) {
        yield models_1.User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield models_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (req.isAdmin) {
        const { username, email, password } = req.body;
        const updatedUser = yield models_1.User.findByIdAndUpdate(userId, {
            username: username,
            email: email,
            password: password
        }, { new: true });
        res.json(updatedUser);
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
exports.updateUser = updateUser;
