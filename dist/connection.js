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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Connection;
const mongoose_1 = __importDefault(require("mongoose"));
function Connection() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = {};
        try {
            if (connection === null || connection === void 0 ? void 0 : connection.isConnected)
                return;
            const db = yield mongoose_1.default.connect(process.env.MONGODB_URI);
            connection.isConnected = db.connection[0].readyState;
        }
        catch (error) {
            console.log("Error connecting to MongoDB", error);
        }
    });
}
