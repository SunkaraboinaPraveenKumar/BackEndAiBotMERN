"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var token_manager_js_1 = require("../utils/token-manager.js");
var validators_js_1 = require("../utils/validators.js");
var chat_controllers_js_1 = require("../controllers/chat-controllers.js");
// Protected API
var chatRoutes = (0, express_1.Router)();
chatRoutes.post("/new", (0, validators_js_1.validate)(validators_js_1.chatCompletionValidator), token_manager_js_1.verifyToken, chat_controllers_js_1.generateChatCompletion);
chatRoutes.get("/all-chats", token_manager_js_1.verifyToken, chat_controllers_js_1.sendChatsToUser);
chatRoutes.delete("/delete", token_manager_js_1.verifyToken, chat_controllers_js_1.deleteChats);
exports.default = chatRoutes;
