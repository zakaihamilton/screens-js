"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const screens_1 = __importDefault(require("../../../lib/screens"));
screens_1.default.CoreAsset = function () {
};
screens_1.default.CoreAsset.init = function () {
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
        this.mapping.map((mapping) => {
            screens_1.default.CoreHttp.register(mapping.match, async (req, resp) => {
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
//# sourceMappingURL=asset.js.map