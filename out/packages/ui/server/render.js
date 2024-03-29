"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../../lib/screens"));
const server_1 = __importDefault(require("react-dom/server"));
const react_1 = __importDefault(require("react"));
screens_1.default.UIRender = function () {
    this.title = "";
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
        let screens_head = await screens_1.default.CoreAsset.file("node_modules/screens-js/packages.head.html") || "";
        let head = await screens_1.default.CoreAsset.file("packages.head.html") || "";
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
                ${screens_head}
                ${head}
            </head>
            <body onload="document.screens.init().then(function() {document.screens.UIRender.component('${component}')})">
            <div id="react">`;
        res.write(html);
        let render = component ? react_1.default.createElement(Component, null) : react_1.default.createElement("div", null);
        const stream = server_1.default.renderToNodeStream(render);
        stream.pipe(res, { end: false });
        return new Promise((resolve => {
            stream.on('end', () => {
                res.write("</div>\n</body>\n</html>");
                res.end();
                resolve();
            });
        }));
    };
};
//# sourceMappingURL=render.js.map