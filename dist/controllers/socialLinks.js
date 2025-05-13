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
exports.updateSocial = exports.getSocialById = exports.postSocial = void 0;
const UserModels_1 = require("../schema/UserModels");
const postSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, fb_link, x_link, linkedin_link } = req.body;
    const newSocial = new UserModels_1.SocialLinks({
        fb_link: fb_link,
        x_link: x_link,
        linkedin_link: linkedin_link,
        userId: userId
    });
    try {
        yield newSocial.save();
        res.status(201).json(newSocial);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error creating social links" });
        return;
    }
});
exports.postSocial = postSocial;
const getSocialById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    try {
        const social = yield UserModels_1.SocialLinks.findOne({ userId: userId });
        res.status(200).json({ message: "Social Links fetched successfully" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching social links" });
        return;
    }
});
exports.getSocialById = getSocialById;
const updateSocial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield UserModels_1.User.findById(userId);
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    try {
        const { fb_link, x_link, linkedin_link } = req.body;
        const updatedLinks = yield UserModels_1.SocialLinks.findOneAndUpdate({ userId: userId }, {
            fb_link: fb_link,
            x_link: x_link,
            linkedin_link: linkedin_link
        }, { new: true });
        res.json({ message: "Social Links updated successfully", updatedLinks });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Error updating social links" });
        return;
    }
});
exports.updateSocial = updateSocial;
