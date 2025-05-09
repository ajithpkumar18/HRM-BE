"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = exports.SocialLinks = exports.UserDetails = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const userDetailsSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        required: true,
    },
    residece: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    fullAddress: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    empRole: {
        type: String,
        required: true,
    },
    empType: {
        type: String,
        required: true,
        enum: ["office", "remote", "hybrid", "part-time", "full-time"]
    },
    address: {
        type: String,
        required: true,
    },
    datOfJooining: {
        type: Date,
        required: true,
    },
    dateOfLeaving: {
        type: Date,
        required: true,
    }
}, { timestamps: true });
const socialLinksSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fb_link: {
        type: String,
        required: true
    },
    x_link: {
        type: String,
        required: true
    },
    linkedin_link: {
        type: String,
        required: true
    },
}, { timestamps: true });
const contactSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    primaryContact: {
        type: String,
        required: true
    },
    alternateContact: {
        type: String,
        required: true
    },
    primaryEmergencyContact: {
        type: String,
        required: true
    },
    alternateEmergencyContact: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
exports.UserDetails = mongoose_1.default.model("UserDetails", userDetailsSchema);
exports.SocialLinks = mongoose_1.default.model("SocialLinks", socialLinksSchema);
exports.Contact = mongoose_1.default.model("Contact", contactSchema);
