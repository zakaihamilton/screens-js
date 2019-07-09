"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
screens_1.default.CoreObject = function () {
    this.create = (info) => {
        const object = screens_1.default.objectify({}, "CoreObject");
        object.parent = this;
        object.children = [];
        object.send(info);
        return object;
    };
    this.destroy = () => {
        let attachments = Object.values(this.me);
        this.children.map((child) => child.destroy());
        attachments.map((attachment) => attachment.destroy && attachment.destroy.call(attachment));
        this.parent = null;
    };
    this.cast = (compId) => {
        if (!(compId in this.me)) {
            return;
        }
        return this.me[compId];
    };
    this.send = (info) => {
        let results = Object.fromEntries(Object.entries(info).map(([compId, props]) => {
            const instance = this.me[compId];
            return Object.fromEntries(Object.entries(props).map(([key, value]) => {
                if (!(key in instance)) {
                    return [];
                }
                if (typeof value === "undefined") {
                    return [];
                }
                let args = [value];
                let prop = Object.getOwnPropertyDescriptor(instance, key);
                if (!prop) {
                    return [];
                }
                let callback = prop.value;
                if (typeof prop.set === "function") {
                    callback = prop.set;
                }
                if (typeof callback === "function") {
                    let result = callback.apply(instance, args);
                    return [key, result];
                }
                return [];
            }));
        }));
        return results;
    };
};
//# sourceMappingURL=object.js.map