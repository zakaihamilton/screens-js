"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
const react_1 = __importStar(require("react"));
screens_1.default.UITest = function () {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = react_1.useState(0);
    const { UITest } = screens_1.default;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(UITest.Child, null),
        react_1.default.createElement("p", null,
            "You clicked ",
            count,
            " times"),
        react_1.default.createElement("button", { onClick: () => setCount(count + 1) }, "Click me")));
};
screens_1.default.UITest.Child = function () {
    return (react_1.default.createElement("div", null, "This works as well"));
};
//# sourceMappingURL=test.js.map