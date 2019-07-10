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
        res.writeHead(200, this.headers);
        res.write("<!DOCTYPE html>");
        let render = react_1.default.createElement("html", null,
            react_1.default.createElement("head", null,
                this.title && react_1.default.createElement("title", null,
                    "$",
                    this.title),
                react_1.default.createElement("link", { rel: "stylesheet", type: "text/css", href: "packages.css" }),
                this.head && this.head),
            react_1.default.createElement("body", null, Component && react_1.default.createElement(Component, null)));
        const stream = server_1.renderToNodeStream(render);
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