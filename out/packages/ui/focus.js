"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
const react_1 = __importDefault(require("react"));
screens_1.default.UIFocus = function ({ focusId, children }) {
    const { UIFocus } = screens_1.default;
    UIFocus.me.CoreListener.register(UIFocus.name, "focusId", (state) => {
        state.order = state.order.filter((id) => id !== state.focusId);
        state.order.push(state.focusId);
    });
    let fields = UIFocus.useFields({ focusId });
    let elements = react_1.default.Children.toArray(children).map((element, index) => {
        return react_1.default.cloneElement(element, { index });
    });
    return (react_1.default.createElement(UIFocus.Fields, { value: fields }, elements));
};
screens_1.default.UIFocus.init = function () {
    const { UIField } = screens_1.default;
    UIField.create(this, {
        focusId: "",
        order: []
    });
};
//# sourceMappingURL=focus.js.map