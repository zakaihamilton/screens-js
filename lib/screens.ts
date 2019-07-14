declare var __dirname: any;

var screens = {
    init() {
        const components = Object.entries(screens).filter(([key, comp]) => /^[A-Z]/.test(key[0]));
        components.map(([key, comp]) => screens.objectify(comp, ""));
        components.map(item => {
            const [key, comp]: [string, any] = item;
            if (comp.static) {
                comp.static.call(comp);
            }
        });
        return Promise.all(components.map(async item => {
            const [key, comp]: [string, any] = item;
            if (comp._isInitialized) {
                return;
            }
            if (comp.init) {
                await comp.init.call(comp);
            }
            comp._isInitialized = true;
            return key;
        }));
    },
    objectify(object: any, compId: string) {
        const attach = (me: any, compId: string, attachment: any) => {
            const comp = (screens as any)[compId];
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
                get: function (obj: any, name: string) {
                    if (name in obj) {
                        return obj[name];
                    }
                    const attachment = { me: object.me, _id: name };
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
    async import(root: string, directory: string, handler: (path: string) => void) {
        if (screens.platform === "server") {
            const pathModule = await import("path");
            const fs = await import("fs");
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
        } else if (screens.platform === "browser") {
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
    async startup(): Promise<object> {
        await screens.import("../packages", __dirname, async (path) => await import(path));
        return screens.init();
    }
}

if (typeof global !== "undefined") {
    (global as any).screens = screens;
}

if (typeof document !== "undefined") {
    (document as any).screens = screens;
    (document as any)["screens-js"] = screens;
}

export default screens as any;
