"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_js_1 = require("./app.js");
var connection_js_1 = require("./db/connection.js");
//GET - get data from backend
//PUT, POST, DELETE
var PORT = process.env.PORT || 3000;
(0, connection_js_1.connectionTodatabase)().then(function () {
    app_js_1.default.listen(PORT, function () {
        console.log("The server is running on ".concat(PORT, " and Connected to database"));
    });
})
    .catch(function (err) { return console.log(err); });
//connections and listeners
