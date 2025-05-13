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
const UserModels_1 = require("../schema/UserModels");
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModels_1.User.find().select("username isAdmin _id");
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
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(user);
});
exports.getUserById = getUserById;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (req.isAdmin) {
        try {
            yield UserModels_1.UserDetails.findOneAndDelete({ userId: userId });
            yield UserModels_1.SocialLinks.findOneAndDelete({ userId: userId });
            yield UserModels_1.PrevEmployment.findOneAndDelete({ userId: userId });
            yield UserModels_1.Document.findOneAndDelete({ userId: userId });
            yield UserModels_1.Contact.findOneAndDelete({ userId: userId });
            yield UserModels_1.User.findByIdAndDelete(userId);
            res.json({ message: "User deleted successfully" });
            return;
        }
        catch (error) {
            res.status(500).json({ message: "Error deleting user" });
            return;
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
    return;
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (req.isAdmin) {
        const { username, email, password } = req.body;
        const updatedUser = yield UserModels_1.User.findByIdAndUpdate(userId, {
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
