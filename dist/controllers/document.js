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
exports.updateDocument = exports.getDocumentById = exports.postDocument = void 0;
const UserModels_1 = require("../schema/UserModels");
const postDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, user_photo, aadhaar_front, aadhaar_back, pan_card } = req.body;
    const newDocument = new UserModels_1.Document({
        userId: userId,
        user_photo: user_photo,
        aadhaar_front: aadhaar_front,
        aadhaar_back: aadhaar_back,
        pan_card: pan_card
    });
    try {
        yield newDocument.save();
        res.status(201).json(newDocument);
    }
    catch (error) {
        res.status(500).json({ message: "Error creating document" });
    }
    return;
});
exports.postDocument = postDocument;
const getDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const userDocument = yield UserModels_1.Document.findOne({ userId: userId });
        if (!userDocument) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(userDocument);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching document" });
    }
    return;
});
exports.getDocumentById = getDocumentById;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { user_photo, aadhaar_front, aadhaar_back, pan_card } = req.body;
    try {
        const updatedDocument = yield UserModels_1.Document.findOneAndUpdate({ userId: userId }, {
            user_photo: user_photo,
            aadhaar_front: aadhaar_front,
            aadhaar_back: aadhaar_back,
            pan_card: pan_card
        }, { new: true });
        res.status(200).json({ message: "Document updated", updatedDocument });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating document" });
    }
    return;
});
exports.updateDocument = updateDocument;
