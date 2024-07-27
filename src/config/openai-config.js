"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureGemini = void 0;
var generative_ai_1 = require("@google/generative-ai");
// Function to configure Google Generative AI client
var configureGemini = function () {
    var apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found in environment variables");
    }
    // Initialize GoogleGenerativeAI with API key
    var genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    return genAI;
};
exports.configureGemini = configureGemini;
