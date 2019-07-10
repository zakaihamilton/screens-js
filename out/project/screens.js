"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../lib/screens"));
screens_1.default.startup().then(() => {
    console.log("init complete");
    screens_1.default.CoreHttp.register(/^\/$/, async function (me) {
        await me.UIRender.component();
    });
});
//# sourceMappingURL=screens.js.map