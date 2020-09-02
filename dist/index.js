"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config = require('./config');
const app = express_1.default();
config.express(app);
config.routes(app);
const { appPort } = config.app;
app.listen(appPort, () => {
    console.log(`Server started: http://localhost:${appPort}`);
});
