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
            pattern: /\.css$/,
            text: {}
        },
        {
            mime: "image/png",
            pattern: /\.png$/
        },
        {
            mime: "application/javascript",
            pattern: /\.js\?template=false$/,
            text: {}
        },
        {
            mime: "application/javascript",
            pattern: /\.js$/,
            text: {
                template: "browser/template.js",
                separator: "\n\n/***********/\n\n"
            }
        },
        {
            mime: "application/json",
            pattern: /\.json$/,
            text: {
                start: "[",
                separator: ",",
                end: "]"
            }
        },
        {
            mime: "application/json",
            pattern: /\.map$/,
            collect: false
        },
        {
            mime: "application/html",
            pattern: /\.head\.html$/,
            text: {}
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
                if (item === "server") {
                    continue;
                }
                collection.push(...await this.collect(itemPath, pattern));
            }
            else if (itemPath.match(pattern)) {
                collection.push(itemPath);
            }
        }
        collection = collection.filter(Boolean);
        return collection;
    };
    this.file = async (root, mapping) => {
        let buffer = "";
        if (!mapping) {
            mapping = this.mapping.find((mapping) => root.match(mapping.pattern));
        }
        root = path.normalize(root);
        let { dir, name } = path.parse(root);
        name = name.split(".")[0];
        const folderPath = dir ? (dir + path.sep + name) : name;
        let filePaths = [root];
        if (typeof this.mapping.collect === "undefined" || this.mapping.collect) {
            filePaths.push(...await this.collect(folderPath, mapping.pattern));
        }
        filePaths = filePaths.filter(Boolean);
        filePaths = filePaths.filter(filePath => fs.existsSync(filePath));
        if (filePaths.length > 1) {
            if (mapping.text && mapping.text.start) {
                buffer = mapping.text.start;
            }
        }
        for (let fileIndex = 0; fileIndex < filePaths.length; fileIndex++) {
            const filePath = filePaths[fileIndex];
            const options = mapping.text ? { encoding: "utf-8" } : {};
            let content = await fs.promises.readFile(filePath, options);
            if (mapping.transform) {
                content = await mapping.transform(content);
            }
            if (mapping.text && mapping.text.template) {
                content = mapping.text.template.replace(/\/\/body\/\//, content);
            }
            if (filePaths.length === 1) {
                if (mapping.text && mapping.text.prefix) {
                    content = mapping.text.prefix + content;
                }
                if (mapping.text && mapping.text.suffix) {
                    content += mapping.text.suffix;
                }
                buffer += content;
            }
            else {
                if (mapping.text && mapping.text.prefix) {
                    buffer += mapping.text.prefix;
                }
                buffer += content;
                if (mapping.text && mapping.text.suffix) {
                    buffer += mapping.text.suffix;
                }
                if (fileIndex < filePaths.length - 1 && mapping.text && mapping.text.separator) {
                    buffer += mapping.text.separator;
                }
            }
        }
        if (filePaths.length > 1) {
            if (mapping.text && mapping.text.end) {
                buffer += mapping.text.end;
            }
        }
        return buffer;
    };
    setTimeout(() => {
        this.mapping.map((mapping) => {
            if (mapping.text && mapping.text.template) {
                let filePath = path.resolve(__dirname, mapping.text.template);
                mapping.text.template = fs.readFileSync(filePath, "utf8");
            }
            screens_1.default.CoreHttp.register(mapping.pattern, async (me) => {
                const { req, res } = me.CoreHttp;
                const headers = {
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": mapping.mime
                };
                let root = req.url.substr(1).split("?")[0];
                res.writeHead(200, headers);
                let buffer = await this.file(root, mapping);
                res.end(buffer);
            });
        });
    });
};
//# sourceMappingURL=asset.js.map