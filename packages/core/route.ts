import screens from "../../lib/screens";

screens.CoreRoute = function () {
    this.routes = new Map();
    this.register = (pattern: RegExp, callback: any) => {
        let callbacks = this.routes.get(pattern);
        if (!callbacks) {
            callbacks = [];
            this.routes.set(pattern, callbacks);
        }
        callbacks.includes(callback) || callbacks.push(callback);
    };
    this.unregister = (pattern: RegExp, callback: any) => {
        let callbacks = this.routes.get(pattern) || [];
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    };
    this.notify = (_this: any, match: string, ...args: any) => {
        for (const [pattern, callbacks] of this.routes.entries()) {
            let result = match.match(pattern);
            if (result) {
                result.shift();
                args = [...args, ...result];
                callbacks.map((callback: any) => callback.apply(_this, args));
            }
        }
    }
};
