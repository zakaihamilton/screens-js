import * as fs from "fs";
import screens from "../../../lib/screens";

interface mapping {
    mime: string;
    match: RegExp;
    options: object;
    transform: any;
}

screens.CoreAsset = function () {

};

screens.CoreAsset.init = function () {
    this.mapping = [
        {
            mime: "text/css",
            match: /\.css$/,
            options: { encoding: "utf-8" }
        },
        {
            "mime": "image/png",
            match: /\.png$/
        },
        {
            "mime": "application/javascript",
            match: /\.js$/,
            options: { encoding: "utf-8" }
        },
        {
            "mime": "application/json",
            match: /\.json$/,
            options: { encoding: "utf-8" }
        }
    ];
    setTimeout(() => {
        this.mapping.map((mapping: mapping) => {
            screens.CoreHttp.register(mapping.match, async (req: any, resp: any) => {
                let path = req.url.substr(1);
                let headers = {
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": mapping.mime
                };
                try {
                    let content = await fs.promises.readFile(path, mapping.options);
                    if (mapping.transform) {
                        content = await mapping.transform(content);
                    }
                    resp.writeHead(200, headers);
                    resp.end(content);
                }
                catch (err) {
                    resp.writeHead(401, headers);
                    resp.end(err.message || err);
                }
            });
        });
    });
};
