import screens from "../../lib/screens";

screens.CoreState = function () {
    this.define = (info: object) => {
        if (!info) {
            return;
        }
        for (const [compId, props] of Object.entries(info)) {
            const instance = this.me[compId];
            for (const key in props) {
                const internal = "_" + key;
                Object.defineProperty(instance, key, {
                    get: () => {
                        return instance[internal]
                    },
                    set: value => {
                        const prev = instance[internal];
                        if (prev === value) {
                            return;
                        }
                        instance[internal] = value;
                        this.me.CoreListener.notify(compId, key, value, prev);
                    }
                });
                instance[internal] = props[key];
            }
        }
    };
};