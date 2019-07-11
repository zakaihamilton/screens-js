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
    this.component = async (component) => {
        let Component = screens_1.default[component];
        let { res } = this.me.CoreHttp;
        if (!res) {
            throw "Not attached to CoreHttp";
        }
        res.writeHead(200, this.headers);
        res.write("<!DOCTYPE html>");
        let script = await screens_1.default.CoreAsset.file("node_modules/screens-js/out/lib.js");
        script += await screens_1.default.CoreAsset.file("node_modules/screens-js/out/packages.js");
        script += await screens_1.default.CoreAsset.file("out/lib.js");
        script += await screens_1.default.CoreAsset.file("out/packages.js");
        let html = `
        <html>
            <head>
                <title>${this.title}</title>
                <link rel="stylesheet" type="text/css" href="packages.css"></link>
                <link rel="stylesheet" type="text/css" href="node_modules/screens-js/packages.css"></link>
                <script src="node_modules/react/umd/react.development.js?template=false"></script>
                <script src="node_modules/react-dom/umd/react-dom.development.js?template=false"></script>
                <script src="node_modules/screens-js/out/lib.js"></script>
                <script src="node_modules/screens-js/out/packages.js"></script>
                <script src="out/lib.js"></script>
                <script src="out/packages.js"></script>
            </head>
            <body onload="document.screens.init().then(function() {document.screens.UIRender.component('${component}')})">`;
        res.write(html);
        let render = component ? react_1.default.createElement(Component, null) : react_1.default.createElement("div", null);
        const stream = server_1.renderToNodeStream(render);
        stream.pipe(res, { end: false });
        return new Promise((resolve => {
            stream.on('end', () => {
                res.write("\n</body>\n</html>");
                res.end();
                resolve();
            });
        }));
    };
};
//# sourceMappingURL=render.js.map