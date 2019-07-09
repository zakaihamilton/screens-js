import screens from "../../lib/screens";

screens.CoreObject = function () {
    this.create = (info: object) => {
        const object = screens.objectify({}, "CoreObject");
        object.parent = this;
        object.children = [];
        object.send(info);
        return object;
    };
    this.destroy = () => {
        let attachments = Object.values(this.me);
        this.children.map((child: any) => child.destroy());
        attachments.map((attachment: any) => attachment.destroy && attachment.destroy.call(attachment));
        this.parent = null;
    };
    this.cast = (compId: string) => {
        if (!(compId in this.me)) {
            return;
        }
        return this.me[compId];
    };
    this.send = (info: object) => {
        let results = Object.fromEntries(Object.entries(info).map(([compId, props]) => {
            const instance = this.me[compId];
            return Object.fromEntries(Object.entries(props).map(([key, value]) => {
                if (!(key in instance)) {
                    return [];
                }
                if (typeof value === "undefined") {
                    return [];
                }
                let args = [value];
                let prop = Object.getOwnPropertyDescriptor(instance, key);
                if (!prop) {
                    return [];
                }
                let callback = prop.value;
                if (typeof prop.set === "function") {
                    callback = prop.set;
                }
                if (typeof callback === "function") {
                    let result = callback.apply(instance, args);
                    return [key, result];
                }
                return [];
            }));
        }));
        return results;
    }
};