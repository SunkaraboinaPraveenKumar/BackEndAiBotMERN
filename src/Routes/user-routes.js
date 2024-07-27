"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controllers_js_1 = require("../controllers/user-controllers.js");
var validators_js_1 = require("../utils/validators.js");
var token_manager_js_1 = require("../utils/token-manager.js");
var userRoutes = (0, express_1.Router)();
userRoutes.get("/", user_controllers_js_1.getAllUsers);
userRoutes.post("/signup", (0, validators_js_1.validate)(validators_js_1.signupValidator), user_controllers_js_1.userSignUp);
userRoutes.post("/login", (0, validators_js_1.validate)(validators_js_1.loginValidator), user_controllers_js_1.userLogin);
userRoutes.get("/auth-status", token_manager_js_1.verifyToken, user_controllers_js_1.verfiyUser);
userRoutes.get("/logout", token_manager_js_1.verifyToken, user_controllers_js_1.userLogout);
//middlewares are functions which gets executes before a request is processes
//in node and express middleware can be used to check JSON Body Validations, 
//Tokens or Cookies Validations,Params validations and more 
//Token Authentication -- JSON Web Token JWT
//HTTP only signed cookies are a type of web cookies that comes 
//with a special security attribute that restricts 
//cookies from being accessed by Javascript in the web-browser. This prevents XSS attacks
exports.default = userRoutes;
