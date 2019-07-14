"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var screens = {
    init() {
        const components = Object.entries(screens).filter(([key, comp]) => /^[A-Z]/.test(key[0]));
        components.map(([key, comp]) => screens.objectify(comp, ""));
        return Promise.all(components.map(async (item) => {
            const [key, comp] = item;
            if (comp.isInitialized) {
                return;
            }
            if (comp.init) {
                await comp.init.call(comp);
            }
            comp.isInitialized = true;
            return key;
        }));
    },
    objectify(object, compId) {
        const attach = (me, compId, attachment) => {
            const comp = screens[compId];
            if (!comp) {
                return;
            }
            me[compId] = attachment;
            if (comp.bind) {
                comp.call(attachment);
            }
            else {
                Object.assign(attachment, comp);
                if (attachment.attach) {
                    attachment.attach.call(attachment);
                }
            }
        };
        if (!object.me) {
            object.me = new Proxy({}, {
                get: function (obj, name) {
                    if (name in obj) {
                        return obj[name];
                    }
                    const attachment = { me: object.me, id: name };
                    attach(object.me, name, attachment);
                    return attachment;
                }
            });
        }
        if (compId) {
            attach(object.me, compId, object);
        }
        return object;
    },
    platform: typeof window !== "undefined" ? "browser" : "server",
    async import(root, directory, handler) {
        if (screens.platform === "server") {
            const pathModule = await Promise.resolve().then(() => __importStar(require("path")));
            const fs = await Promise.resolve().then(() => __importStar(require("fs")));
            let path = pathModule.resolve(directory, root);
            var names = fs.readdirSync(path);
            const dirs = [];
            for (let name of names) {
                if (name === "browser") {
                    continue;
                }
                let child = root + "/" + name;
                if (name.endsWith(".js")) {
                    console.log("importing " + name);
                    await handler(child);
                    continue;
                }
                let isDirectory = fs.lstatSync(path + "/" + name).isDirectory();
                if (isDirectory) {
                    dirs.push(child);
                }
            }
            if (dirs.length) {
                for (let file of dirs) {
                    await screens.import(file, directory, handler);
                }
            }
        }
        else if (screens.platform === "browser") {
            const script = document.getElementById(root);
            if (script) {
                return;
            }
            return new Promise((resolve, reject) => {
                const parentNode = document.getElementsByTagName("head")[0];
                const item = document.createElement("script");
                item.type = "module";
                item.src = root;
                item.async = true;
                item.onload = () => {
                    resolve(item);
                };
                item.onerror = () => {
                    console.log("Failure in loading file: " + root);
                    reject(root);
                };
                parentNode.appendChild(item);
            });
        }
    },
    async startup() {
        await screens.import("../packages", __dirname, async (path) => await Promise.resolve().then(() => __importStar(require(path))));
        return screens.init();
    }
};
if (typeof global !== "undefined") {
    global.screens = screens;
}
if (typeof document !== "undefined") {
    document.screens = screens;
    document["screens-js"] = screens;
}
exports.default = screens;
//# sourceMappingURL=screens.js.map