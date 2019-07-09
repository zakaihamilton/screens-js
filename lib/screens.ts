var screens = {
    init() {
        const components = Object.entries(screens).filter(([key, comp]) => /^[A-Z]/.test(key[0]));
        components.map(([key, comp]) => screens.objectify(comp, ""));
        return Promise.all(components.map(item => {
            const [, comp] = item;
            if (comp.hasOwnProperty("init")) {
                (comp as any).init.call(comp);
            }
        }));
    },
    objectify(object: any, compId: string) {
        const attach = (me: any, compId: string, attachment: any) => {
            const comp = (screens as any)[compId];
            if (!comp) {
                return undefined;
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
        object.me = new Proxy({}, {
            get: function (obj: any, name: string) {
                if (name in obj) {
                    return obj[name];
                }
                const attachment = { me: object.me, id: name };
                attach(object.me, name, attachment);
                return attachment;
            }
        });
        if (compId) {
            attach(object.me, compId, object);
        }
        return object;
    },
    platform: typeof window !== "undefined" ? "browser" : "server",
    async import(root: string) {
        if (screens.platform === "server") {
            const pathModule = await import("path");
            const fs = await import("fs");
            const dir = process.cwd();
            let path = root;
            var names = fs.readdirSync(path);
            const dirs = [];
            for (let name of names) {
                if (name === "browser") {
                    continue;
                }
                let child = path + "/" + name;
                if (name.endsWith(".js")) {
                    console.log("importing " + name);
                    let relPath = child.replace(/^out\//, "../");
                    await import(relPath);
                    continue;
                }
                let isDirectory = fs.lstatSync(child).isDirectory();
                if (isDirectory) {
                    dirs.push(child);
                }
            }
            if (dirs.length) {
                for (let file of dirs) {
                    await screens.import(file);
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
    }
}

if (typeof global !== "undefined") {
    (global as any).screens = screens;
}

if (typeof document !== "undefined") {
    (document as any).screens = screens;
}

export default screens as any;

Object.defineProperty(Object.prototype, "me", {
    get() {
        if (this._me) {
            return this._me;
        }
        else {
            screens.objectify(this, "");
            return this._me;
        }
    },
    set(me) {
        this._me = me;
    }
});
