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
const path = __importStar(require("path"));
const screens_1 = __importDefault(require("../../../lib/screens"));
screens_1.default.CoreAsset = function () {
};
screens_1.default.CoreAsset.init = function () {
    this.mapping = [
        {
            mime: "text/css",
            match: /\.css$/,
            text: true
        },
        {
            "mime": "image/png",
            match: /\.png$/
        },
        {
            "mime": "application/javascript",
            match: /\.js$/,
            text: true,
            collect: {
                separator: "\n\n/***********/\n\n"
            }
        },
        {
            "mime": "application/json",
            match: /\.json$/,
            text: true,
            collect: {
                prefix: "[",
                separator: ",",
                suffix: "]"
            }
        }
    ];
    this.collect = async (root, pattern) => {
        const exists = fs.existsSync(root);
        if (!exists) {
            return [];
        }
        let collection = [];
        const items = await fs.promises.readdir(root);
        for (let item of items) {
            let itemPath = path.resolve(root, item);
            const isDirectory = (await fs.promises.lstat(itemPath)).isDirectory();
            if (isDirectory) {
                collection.push(...await this.collect(itemPath, pattern));
            }
            else if (itemPath.match(pattern)) {
                collection.push(itemPath);
            }
        }
        collection = collection.filter(Boolean);
        return collection;
    };
    setTimeout(() => {
        this.mapping.map((mapping) => {
            screens_1.default.CoreHttp.register(mapping.match, async (me) => {
                const { req, res } = me.CoreHttp;
                let root = req.url.substr(1);
                root = path.normalize(root);
                const { dir, name } = path.parse(root);
                const folderPath = dir ? (dir + path.sep + name) : name;
                const headers = {
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": mapping.mime
                };
                let filePaths = [root, ...await this.collect(folderPath, mapping.match)];
                filePaths = filePaths.filter(Boolean);
                filePaths = filePaths.filter(filePath => fs.existsSync(filePath));
                if (!filePaths.length) {
                    res.writeHead(401, headers);
                    res.end(root + " does not exist!");
                }
                if (filePaths.length > 1) {
                    headers["Transfer-Encoding"] = "chunked";
                    if (mapping.collect && mapping.collect.prefix) {
                        res.write(mapping.collect.prefix);
                    }
                }
                console.log(filePaths.join(","));
                res.writeHead(200, headers);
                for (const filePath of filePaths) {
                    const options = mapping.text ? { encoding: "utf-8" } : {};
                    let content = await fs.promises.readFile(filePath, options);
                    if (mapping.transform) {
                        content = await mapping.transform(content);
                    }
                    if (filePaths.length === 1) {
                        res.end(content);
                    }
                    else {
                        res.write(content);
                        if (mapping.collect && mapping.collect.separator) {
                            res.write(mapping.collect.separator);
                        }
                    }
                }
                if (filePaths.length > 1) {
                    if (mapping.collect && mapping.collect.suffix) {
                        res.write(mapping.collect.suffix);
                    }
                    res.end();
                }
            });
        });
    });
};
//# sourceMappingURL=asset.js.map