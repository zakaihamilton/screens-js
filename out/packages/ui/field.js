"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../../lib/screens"));
const react_1 = __importStar(require("react"));
screens_1.default.UIField = function () {
};
screens_1.default.UIField.static = function () {
    this.create = function (component, fields) {
        component.ids = {};
        for (let key in fields) {
            component[key] = react_1.default.createContext(fields[key]);
            component[key].displayName = component.name + "." + key;
        }
        component.useFields = (defaults) => {
            defaults = Object.assign({}, defaults);
            Object.keys(defaults).forEach(key => defaults[key] === undefined && delete defaults[key]);
            const [state, setState] = react_1.useState(Object.assign({}, fields, defaults));
            let [callbacks, setCallbacks] = react_1.useState(null);
            if (!callbacks) {
                callbacks = {};
                for (let key in fields) {
                    callbacks[key] = (value) => {
                        if (Object.is(state[key], value)) {
                            return;
                        }
                        state[key] = value;
                        component.me.CoreListener.notify(component.name, key, state);
                        console.log("changed " + key + " value to: " + value);
                        if (!state._resolves) {
                            state._resolves = [];
                        }
                        let promise = new Promise((resolve, reject) => {
                            if (!state._timeout) {
                                state._timeout = setTimeout(() => {
                                    state._timeout = null;
                                    let currentCounter = (state[key]._counter || 0);
                                    let counter = currentCounter + 1;
                                    setState(Object.assign({}, state, { _counter: counter }));
                                    let id = state.id;
                                    if (id) {
                                        values[key][0] = state[key];
                                        component.ids[id] = values;
                                    }
                                    state._resolves.map((resolve) => resolve());
                                    state._resolves = [];
                                });
                            }
                            state._resolves.push(resolve);
                        });
                        return promise;
                    };
                }
                setCallbacks(callbacks);
            }
            let values = {};
            for (let key in state) {
                const method = callbacks[key];
                values[key] = [state[key], method];
            }
            react_1.useEffect(() => {
                let id = state.id;
                if (id) {
                    component.ids[id] = values;
                    return () => {
                        delete component.ids[id];
                    };
                }
            }, []);
            return values;
        };
        component.Fields = ({ value, children }) => {
            const fields = value;
            let keys = Object.keys(fields);
            let iterate = (index) => {
                let key = keys[index++];
                if (index > keys.length) {
                    return children;
                }
                while (key.startsWith("_")) {
                    key = keys[index++];
                    if (index > keys.length) {
                        return children;
                    }
                }
                let value = fields[key];
                if (!(key in component)) {
                    throw key + " in " + component.name + " is not defined in UIField.create";
                }
                return react_1.default.createElement(component[key].Provider, { value }, iterate(index));
            };
            let result = iterate(0);
            return result;
        };
        component.Fields.displayName = component.name + ".Fields";
    };
};
//# sourceMappingURL=field.js.map