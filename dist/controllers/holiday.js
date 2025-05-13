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
exports.updateHoliday = exports.deleteHoliday = exports.getHoliday = exports.postHolidays = void 0;
const UserModels_1 = require("../schema/UserModels");
const postHolidays = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, day, description } = req.body;
    const newHoliday = new UserModels_1.Holiday({
        date: date,
        day: day,
        description: description
    });
    try {
        yield newHoliday.save();
        res.status(201).json("New holiday created successfully");
    }
    catch (error) {
        res.status(500).json({ message: "Error creating holiday" });
    }
    return;
});
exports.postHolidays = postHolidays;
const getHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const holidays = yield UserModels_1.Holiday.find();
        if (!holidays) {
            res.status(404).json({ message: "No users found" });
            return;
        }
        res.status(200).json(holidays);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching holidays" });
    }
    return;
});
exports.getHoliday = getHoliday;
const deleteHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const holidayId = req.params.id;
    if (req.isAdmin) {
        yield UserModels_1.Holiday.findByIdAndDelete(holidayId);
        res.json({ message: "Holiday deleted successfully" });
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
    return;
});
exports.deleteHoliday = deleteHoliday;
const updateHoliday = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const holidayId = req.params.id;
    if (req.isAdmin) {
        const { date, day, description } = req.body;
        try {
            const updatedHoliday = yield UserModels_1.Holiday.findByIdAndUpdate(holidayId, {
                date: date,
                day: day,
                description: description
            }, { new: true });
            res.json(updatedHoliday);
        }
        catch (error) {
            res.status(500).json({ message: "Error updating holiday" });
        }
    }
    else {
        res.status(403).json({ message: "Unauthorized" });
    }
    return;
});
exports.updateHoliday = updateHoliday;
