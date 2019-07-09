"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
screens_1.default.CoreState = function () {
    this.define = (info) => {
        if (!info) {
            return;
        }
        for (const [compId, props] of Object.entries(info)) {
            const instance = this.me[compId];
            for (const key in props) {
                const internal = "_" + key;
                Object.defineProperty(instance, key, {
                    get: () => {
                        return instance[internal];
                    },
                    set: value => {
                        const prev = instance[internal];
                        if (prev === value) {
                            return;
                        }
                        instance[internal] = value;
                        this.me.CoreListener.notify(compId, key, value, prev);
                    }
                });
                instance[internal] = props[key];
            }
        }
    };
};
//# sourceMappingURL=state.js.map