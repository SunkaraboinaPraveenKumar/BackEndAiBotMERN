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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogout = exports.verfiyUser = exports.userLogin = exports.userSignUp = exports.getAllUsers = void 0;
var User_js_1 = require("../models/User.js");
var bcrypt_1 = require("bcrypt");
var token_manager_js_1 = require("../utils/token-manager.js");
var constants_js_1 = require("../utils/constants.js");
var getAllUsers = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var users, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_js_1.default.find()];
            case 1:
                users = _a.sent();
                return [2 /*return*/, res.status(200).json({ message: 'ok', users: users })];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, res.status(500).json({ message: 'Error', cause: error_1.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllUsers = getAllUsers;
var userSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email, password, existingUser, hashedPassword, user, token, expires, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, name_1 = _a.name, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_js_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(401).send("User Already Exists")];
                }
                return [4 /*yield*/, (0, bcrypt_1.hash)(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                user = new User_js_1.default({ name: name_1, email: email, password: hashedPassword });
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                //create token and store cookie
                res.clearCookie(constants_js_1.COOKIE_NAME, {
                    httpOnly: true,
                    domain: "localhost",
                    signed: true,
                    path: "/"
                });
                token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, "7d");
                expires = new Date();
                expires.setDate(expires.getDate() + 7);
                res.cookie(constants_js_1.COOKIE_NAME, token, {
                    path: "/",
                    domain: "localhost",
                    expires: expires,
                    httpOnly: true,
                    signed: true,
                    sameSite: 'none',
                    secure: true, // Ensure you use HTTPS in production
                });
                return [2 /*return*/, res.status(201).json({ message: 'ok', name: user.name, email: user.email })];
            case 4:
                error_2 = _b.sent();
                console.log(error_2);
                return [2 /*return*/, res.status(500).json({ message: 'Error', cause: error_2.message })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.userSignUp = userSignUp;
var userLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isPasswordCorrect, token, expires, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, User_js_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("User Not Registered")];
                }
                return [4 /*yield*/, (0, bcrypt_1.compare)(password, user.password)];
            case 2:
                isPasswordCorrect = _b.sent();
                if (!isPasswordCorrect) {
                    return [2 /*return*/, res.status(403).send("Incorrect Password")];
                }
                res.clearCookie(constants_js_1.COOKIE_NAME, {
                    httpOnly: true,
                    domain: "localhost",
                    signed: true,
                    path: "/"
                });
                token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, "7d");
                expires = new Date();
                expires.setDate(expires.getDate() + 7);
                res.cookie(constants_js_1.COOKIE_NAME, token, {
                    path: "/",
                    domain: "localhost",
                    expires: expires,
                    httpOnly: true,
                    signed: true,
                    sameSite: 'none',
                    secure: true, // Ensure you use HTTPS in production
                });
                return [2 /*return*/, res.status(200).json({ message: 'ok', name: user.name, email: user.email })];
            case 3:
                error_3 = _b.sent();
                console.log(error_3);
                return [2 /*return*/, res.status(500).json({ message: 'Error', cause: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.userLogin = userLogin;
var verfiyUser = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_js_1.default.findById({ _id: res.locals.jwtData.id })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("User Not Registered or Tokem malfunctioned!")];
                }
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res.status(401).send("Permissions Donot Match!!")];
                }
                return [2 /*return*/, res.status(200).json({ message: 'ok', name: user.name, email: user.email })];
            case 2:
                error_4 = _a.sent();
                console.log(error_4);
                return [2 /*return*/, res.status(500).json({ message: 'Error', cause: error_4.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.verfiyUser = verfiyUser;
var userLogout = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, User_js_1.default.findById({ _id: res.locals.jwtData.id })];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).send("User Not Registered or Tokem malfunctioned!")];
                }
                if (user._id.toString() !== res.locals.jwtData.id) {
                    return [2 /*return*/, res.status(401).send("Permissions Donot Match!!")];
                }
                res.clearCookie(constants_js_1.COOKIE_NAME, {
                    path: "/",
                    domain: "localhost",
                    sameSite: 'none',
                    secure: true, // Ensure you use HTTPS in production
                });
                return [2 /*return*/, res.status(200).json({ message: 'ok', name: user.name, email: user.email })];
            case 2:
                error_5 = _a.sent();
                console.log(error_5);
                return [2 /*return*/, res.status(500).json({ message: 'Error', cause: error_5.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.userLogout = userLogout;
