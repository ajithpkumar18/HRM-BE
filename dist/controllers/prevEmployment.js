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
exports.updatePrevEmployment = exports.getPrevEmploymentById = exports.postPrevEmployment = void 0;
const UserModels_1 = require("../schema/UserModels");
const postPrevEmployment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, companyName, designation, empType, address, dateOfJoining, dateOfLeaving } = req.body;
    const newPrevEmployment = new UserModels_1.PrevEmployment({
        userId: userId,
        companyName: companyName,
        designation: designation,
        empType: empType,
        address: address,
        dateOfJoining: dateOfJoining,
        dateOfLeaving: dateOfLeaving
    });
    yield newPrevEmployment.save();
    res.status(201).json({ message: "PrevEmployment created successfully" });
});
exports.postPrevEmployment = postPrevEmployment;
const getPrevEmploymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    try {
        const prevEmployment = yield UserModels_1.PrevEmployment.findOne({ userId: userId });
        res.status(200).json(prevEmployment);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching prev employment" });
    }
    return;
});
exports.getPrevEmploymentById = getPrevEmploymentById;
const updatePrevEmployment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.updatePrevEmployment = updatePrevEmployment;
