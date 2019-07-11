import screens from "../../../lib/screens";
import ReactDOM from 'react-dom/server';
import React, { useState } from 'react';

screens.UIRender = function () {
    this.title = "";
    this.head = null;
    this.headers = {
        "Content-Type": "text/html",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
    };
    this.component = async (component: string) => {
        let Component = screens[component];
        let { res } = this.me.CoreHttp;
        if (!res) {
            throw "Not attached to CoreHttp";
        }
        res.writeHead(200, this.headers);
        res.write("<!DOCTYPE html>");
        let script = await screens.CoreAsset.file("node_modules/screens-js/out/lib.js");
        script += await screens.CoreAsset.file("node_modules/screens-js/out/packages.js");
        script += await screens.CoreAsset.file("out/lib.js");
        script += await screens.CoreAsset.file("out/packages.js");
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
            <body onload="document.screens.init().then(function() {document.screens.UIRender.component('${component}')})">
            <div id="react">`;
        res.write(html);
        let render = component ? <Component /> : <div />;
        const stream = ReactDOM.renderToNodeStream(render);
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
