"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../../lib/screens"));
const react_dom_1 = __importDefault(require("react-dom"));
screens_1.default.UIRender = function () {
    this.component = async (Component) => {
        react_dom_1.default.hydrate(Component, null, undefined);
    };
};
//# sourceMappingURL=render.js.map