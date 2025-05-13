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
exports.updateContact = exports.getContactById = exports.postContact = void 0;
const UserModels_1 = require("../schema/UserModels");
const postContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { primaryContact, alternateContact, primaryEmergencyContact, alternateEmergencyContact } = req.body;
    const newContact = new UserModels_1.Contact({
        userId: userId,
        primaryContact,
        alternateContact,
        primaryEmergencyContact,
        alternateEmergencyContact
    });
    try {
        yield newContact.save();
        res.status(200).json({ message: "Contact created successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating contact" });
    }
    return;
});
exports.postContact = postContact;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userDocument = yield UserModels_1.Contact.findOne({ userId: userId });
        res.status(200).json(userDocument);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching document" });
    }
    return;
});
exports.getContactById = getContactById;
const updateContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { primaryContact, alternateContact, primaryEmergencyContact, alternateEmergencyContact } = req.body;
    try {
        const updatedContact = yield UserModels_1.Contact.findOneAndUpdate({ userId: userId }, {
            primaryContact,
            alternateContact,
            primaryEmergencyContact,
            alternateEmergencyContact
        }, { new: true });
        res.status(200).json({ message: "Contact updated", updatedContact });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating Contact" });
    }
    return;
});
exports.updateContact = updateContact;
