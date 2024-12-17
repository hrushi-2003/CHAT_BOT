"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpSchema = zod_1.default.object({
    name: zod_1.default.string().min(2, "minimum of length 2"),
    email: zod_1.default.string().email("Invalid email"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters"),
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string().email("Invalid email"),
    password: zod_1.default.string().min(8, "Password must be at least 8 characters"),
});
