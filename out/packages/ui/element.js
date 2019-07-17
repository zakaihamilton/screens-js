"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
const react_1 = __importDefault(require("react"));
screens_1.default.UIElement = function () {
    this.me.CoreListener.register("UIReact", "render", () => {
        if (!this.ref) {
            this.ref = react_1.default.createRef();
        }
    });
    this.render = () => {
        if (this.ref && this.ref.current) {
            this.ref.current.source = this;
        }
    };
    this.destroy = () => {
        if (this.ref && this.ref.current) {
            this.ref.current.source = null;
        }
    };
};
screens_1.default.UIElement.init = function () {
};
//# sourceMappingURL=element.js.map