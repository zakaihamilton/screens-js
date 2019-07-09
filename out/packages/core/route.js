"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
screens_1.default.CoreRoute = function () {
    this.routes = new Map();
    this.register = (pattern, callback) => {
        let callbacks = this.routes.get(pattern);
        if (!callbacks) {
            callbacks = [];
            this.routes.set(pattern, callbacks);
        }
        callbacks.includes(callback) || callbacks.push(callback);
    };
    this.unregister = (pattern, callback) => {
        let callbacks = this.routes.get(pattern) || [];
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    };
    this.notify = (_this, match, ...args) => {
        for (const [pattern, callbacks] of this.routes.entries()) {
            let result = match.match(pattern);
            if (result) {
                result.shift();
                args = [...args, ...result];
                callbacks.map((callback) => callback.apply(_this, args));
            }
        }
    };
};
//# sourceMappingURL=route.js.map