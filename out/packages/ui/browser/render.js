"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../../lib/screens"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_1 = __importDefault(require("react"));
screens_1.default.UIRender = function () {
};
screens_1.default.UIRender.component = async (component) => {
    let Component = screens_1.default[component];
    react_dom_1.default.hydrate(react_1.default.createElement(Component, null), document.getElementById("react"), undefined);
};
//# sourceMappingURL=render.js.map