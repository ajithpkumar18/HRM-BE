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
exports.updateUserDetails = exports.getUserDetailsById = exports.getUserDetails = exports.postUserDetails = void 0;
const UserModels_1 = require("../schema/UserModels");
const postUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    const { fullName, residece, dateOfBirth, fullAddress, designation, empRole, empType, team, address, datOfJooining, dateOfLeaving } = req.body;
    const newUserDetails = new UserModels_1.UserDetails({
        userId,
        fullName,
        residece,
        dateOfBirth,
        fullAddress,
        designation,
        empRole,
        empType,
        team,
        address,
        datOfJooining,
        dateOfLeaving
    });
    try {
        yield newUserDetails.save();
        res.status(201).json(newUserDetails);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error creating user details" });
        console.log(error);
        return;
    }
});
exports.postUserDetails = postUserDetails;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userDetails = yield UserModels_1.UserDetails.find();
    ;
    if (!userDetails) {
        res.status(404).json({ message: "No users found" });
        return;
    }
    console.log(req.isAdmin, "req.body");
    res.json(userDetails);
    return;
});
exports.getUserDetails = getUserDetails;
const getUserDetailsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const userDetails = yield UserModels_1.UserDetails.findOne({ userId: userId });
    if (!userDetails) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(userDetails);
    return;
});
exports.getUserDetailsById = getUserDetailsById;
const updateUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    if (req.isAdmin) {
        const { fullName, residece, dateOfBirth, fullAddress, designation, empRole, empType, team, address, datOfJooining, dateOfLeaving } = req.body;
        const updatedUser = yield UserModels_1.UserDetails.findOneAndUpdate({ userId: userId }, {
            fullName,
            residece,
            dateOfBirth,
            fullAddress,
            designation,
            empRole,
            empType,
            team,
            address,
            datOfJooining,
            dateOfLeaving
        }, { new: true });
        res.status(200).json({ message: "User details updated", updatedUser });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
});
exports.updateUserDetails = updateUserDetails;
