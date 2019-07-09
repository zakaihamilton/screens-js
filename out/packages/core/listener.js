"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
screens_1.default.CoreListener = function () {
    this.listeners = {};
    this.register = (compId, name, callback) => {
        const comp = this.listeners[compId] || (this.listeners[compId] = {});
        const listeners = comp[name] || (comp[name] = []);
        listeners.includes(callback) || listeners.push(callback);
    };
    this.unregister = (compId, name, callback) => {
        const comp = this.listeners[compId] || {};
        const listeners = comp[name] || [];
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
    this.notify = (compId, name, ...args) => {
        const comp = this.listeners[compId] || {};
        const listeners = comp[name] || [];
        listeners.map((listener) => listener.apply(this.me[compId], args));
    };
};
//# sourceMappingURL=listener.js.map