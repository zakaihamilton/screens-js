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
        if (!Component) {
            return;
        }
        res.writeHead(200, this.headers);
        let title = this.title ? `<title>${this.title}</title>` : "";
        res.write(`<!DOCTYPE html><html><head>${title}${this.head || ""}</head><body>`);
        const stream = renderToNodeStream(<Component />);
        stream.pipe(res, { end: false });
        return new Promise((resolve => {
            stream.on('end', () => {
                res.write("</div></body></html>");
                res.end();
                resolve();
            });
        }));
    };
};
