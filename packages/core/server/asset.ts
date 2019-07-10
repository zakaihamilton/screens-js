import * as fs from "fs";
import * as path from "path";
import screens from "../../../lib/screens";

interface mapping {
    mime: string;
    match: RegExp;
    transform: any;
    text: boolean;
    collect?: {
        prefix: string;
        separator: string;
        suffix: string;
    }
}

screens.CoreAsset = function () {

};

screens.CoreAsset.init = function () {
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
    this.collect = async (root: string, pattern: string) => {
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
                collection.push(... await this.collect(itemPath, pattern));
            }
            else if (itemPath.match(pattern)) {
                collection.push(itemPath);
            }
        }
        collection = collection.filter(Boolean);
        return collection;
    };
    setTimeout(() => {
        this.mapping.map((mapping: mapping) => {
            screens.CoreHttp.register(mapping.match, async (me: any) => {
                const { req, res } = me.CoreHttp;
                let root = req.url.substr(1);
                root = path.normalize(root);
                const { dir, name } = path.parse(root);
                const folderPath = dir ? (dir + path.sep + name) : name;
                const headers: any = {
                    "Access-Control-Allow-Methods": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Content-Type": mapping.mime
                };
                let filePaths = [root, ... await this.collect(folderPath, mapping.match)];
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
