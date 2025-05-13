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
exports.updateAttendance = exports.logoutAttendance = exports.presentAttendance = void 0;
const UserModels_1 = require("../schema/UserModels");
const utils_1 = require("../utils/utils");
const presentAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const status = req.body.status;
    const today = new Date();
    const dateOnly = new Date(today.setHours(0, 0, 0, 0));
    try {
        const existing = yield UserModels_1.Attendance.findOne({ userId: userId, date: dateOnly });
        if (existing) {
            res.status(200).json({ message: "Attendance already marked" });
            return;
        }
        const newAttendance = new UserModels_1.Attendance({
            userId: userId,
            date: dateOnly,
            checkInTime: today,
        });
        if (status !== "Present") {
            newAttendance.status = "Leave";
        }
        else {
            newAttendance.status = "Present";
        }
        res.status(200).json({ message: "Attendance marked successfully at", });
        yield newAttendance.save();
    }
    catch (error) {
        res.status(500).json({ message: "Error: Attendance not marked", time: (0, utils_1.formatTime)(today) });
    }
    return;
});
exports.presentAttendance = presentAttendance;
const logoutAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const today = new Date();
    const dateOnly = new Date(today.setHours(0, 0, 0, 0));
    try {
        const attendance = yield UserModels_1.Attendance.findOne({ userId: userId, date: dateOnly, status: "Present" });
        if (!attendance) {
            res.status(404).json({ message: "You are absent for today" });
            return;
        }
        attendance.checkOutTime = today;
        yield attendance.save();
        res.status(200).json({ message: "Logout marked successfully at", time: (0, utils_1.formatTime)(today) });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching document" });
    }
    return;
});
exports.logoutAttendance = logoutAttendance;
const updateAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const checkInTime = req.body;
    const dateOnly = new Date(checkInTime.setHours(0, 0, 0, 0));
    try {
        const updatedAttendance = yield UserModels_1.Attendance.findOneAndUpdate({ userId: userId, date: dateOnly, status: "Present" }, {
            checkInTime
        }, { new: true });
        res.status(200).json({ message: "Login time updated successfully", updatedAttendance });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Attendance" });
    }
    return;
});
exports.updateAttendance = updateAttendance;
