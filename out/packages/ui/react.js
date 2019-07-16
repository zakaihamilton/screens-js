"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
const react_1 = require("react");
screens_1.default.UIReact = function () {
};
screens_1.default.UIReact.static = function () {
    this.useObject = function () {
        let ref = react_1.useRef(null);
        let object = ref.current;
        if (!object) {
            object = ref.current = {};
            screens_1.default.objectify(object, "UIReact");
        }
        react_1.useEffect(() => {
            return () => {
                object.me.CoreObject.destroy();
            };
        }, []);
        object.me.CoreListener.notify("UIReact", "render");
        return object;
    };
    this.classes = function (classes) {
        let string = "";
        for (let key in classes) {
            let value = classes[key];
            if (value) {
                string += key + " ";
            }
        }
        return string.trim();
    };
};
//# sourceMappingURL=react.js.map