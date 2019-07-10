"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../../lib/screens"));
const server_1 = require("react-dom/server");
const react_1 = __importDefault(require("react"));
screens_1.default.UIRender = function () {
    this.title = "";
    this.head = null;
    this.headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    };
    this.component = async (Component) => {
        let { res } = this.me.CoreHttp;
        if (!res) {
            throw "Not attached to CoreHttp";
        }
        if (!Component) {
            return;
        }
        res.writeHead(200, this.headers);
        let title = this.title ? `<title>${this.title}</title>` : "";
        res.write(`<!DOCTYPE html><html><head>${title}${this.head || ""}</head><body>`);
        const stream = server_1.renderToNodeStream(react_1.default.createElement(Component, null));
        stream.pipe(res, { end: false });
        return new Promise((resolve => {
            stream.on('end', () => {
                res.write("</body></html>");
                res.end();
                resolve();
            });
        }));
    };
};
//# sourceMappingURL=render.js.map