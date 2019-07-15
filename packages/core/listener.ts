import screens from "../../lib/screens";

screens.CoreListener = function () {
    this.listeners = {};
    this.register = (compId: string, name: string, callback: any) => {
        const comp = this.listeners[compId] || (this.listeners[compId] = {});
        const listeners = comp[name] || (comp[name] = []);
        listeners.includes(callback) || listeners.push(callback);
    };
    this.unregister = (compId: string, name: string, callback: any) => {
        const comp = this.listeners[compId] || {};
        const listeners = comp[name] || [];
        const index = listeners.indexOf(callback);
        if (index !== -1) {
            listeners.splice(index, 1);
        }
    };
    this.notify = (compId: string, name: string, ...args: any) => {
        const comp = this.listeners[compId] || {};
        const listeners = comp[name] || [];
        listeners.map((listener: any) => listener.apply(this, args));
    }
};
