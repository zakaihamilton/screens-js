import screens from "../../../lib/screens";
import { renderToNodeStream } from 'react-dom/server';
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
    this.component = async (Component: any) => {
        let { res } = this.me.CoreHttp;
        if (!res) {
            throw "Not attached to CoreHttp";
        }
        res.writeHead(200, this.headers);
        res.write("<!DOCTYPE html>");
        let render = <html>
            <head>
                {this.title && <title>${this.title}</title>}
                <link rel="stylesheet" type="text/css" href="packages.css"></link>
                <link rel="stylesheet" type="text/css" href="node_modules/screens-js/packages.css"></link>
                <script src="node_modules/screens-js/out/packages.js"></script>
                <script src="out/packages.js"></script>
                {this.head && this.head}
            </head>
            <body>
                {Component && <Component />}
            </body>
        </html>;
        const stream = renderToNodeStream(render);
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
