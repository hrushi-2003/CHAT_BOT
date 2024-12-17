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
exports.login = exports.createAccount = exports.getAllUsers = void 0;
const user_1 = __importDefault(require("../modals/user"));
const validator_1 = require("../utils/validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
// get all user details
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find();
        return res.status(201).json({ message: "ok", users });
    }
    catch (error) {
        return res.status(400).json("error while fetching");
    }
});
exports.getAllUsers = getAllUsers;
// signup endpoint
const createAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield req.body;
        const { success, error } = validator_1.signUpSchema.safeParse(req.body);
        if (!success) {
            return res.status(200).json({
                message: error.errors,
            });
        }
        const ifAlreadyExists = yield user_1.default.findOne({
            email: user.email,
        });
        if (ifAlreadyExists) {
            return res.status(401).json({
                message: "user with email already exists",
                success: false,
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(user.password, 10);
        const new_user = yield user_1.default.create(Object.assign(Object.assign({}, user), { password: hashedPassword }));
        res.clearCookie(constants_1.COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const secret = process.env.JWT_SECRET || "";
        const accessToken = jsonwebtoken_1.default.sign({ email: user.email }, secret, {
            expiresIn: "1h",
        });
        res.cookie(constants_1.COOKIE_NAME, accessToken, {
            path: "/",
            domain: "localhost",
            expiresIn: "1h",
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({
            message: "Account created successfully",
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createAccount = createAccount;
// login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield req.body;
        const { success, error } = validator_1.loginSchema.safeParse(req.body);
        if (!success) {
            return res.status(400).json({
                message: "validation error",
                error: error.errors,
            });
        }
        const user = yield user_1.default.findOne({
            email: data.email,
        });
        if (!user) {
            return res.status(400).json({
                message: "user doesnt exist please signup",
            });
        }
        const isMatched = yield bcrypt_1.default.compare(data.password, user.password);
        if (!isMatched) {
            return res.status(400).json({
                message: "password is incorrect",
            });
        }
        res.clearCookie(constants_1.COOKIE_NAME, {
            path: "/",
            httpOnly: true,
            domain: "localhost",
            signed: true,
        });
        const secret = process.env.JWT_SECRET;
        const accessToken = jsonwebtoken_1.default.sign({ email: data.email }, secret || "", {
            expiresIn: "1h",
        });
        res.cookie(constants_1.COOKIE_NAME, accessToken, {
            path: "/",
            domain: "localhost",
            expiresIn: "1h",
            httpOnly: true,
            signed: true,
        });
        return res.status(200).json({
            message: "logged in successfully",
            accessToken,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.login = login;
