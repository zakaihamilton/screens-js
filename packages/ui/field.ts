import screens from "../../lib/screens";
import React, { useState, useEffect } from 'react';

screens.UIField = function () {

};

screens.UIField.static = function () {
    this.create = function (component: any, fields: any) {
        component.ids = {};
        for (let key in fields) {
            component[key] = React.createContext(fields[key]);
            component[key].displayName = component.name + "." + key;
        }
        component.useFields = (defaults: any): any => {
            defaults = Object.assign({}, defaults);
            Object.keys(defaults).forEach(key => defaults[key] === undefined && delete defaults[key])
            const [state, setState] = useState(Object.assign({}, fields, defaults));
            let [callbacks, setCallbacks]: [any, any] = useState(null);
            if (!callbacks) {
                callbacks = {};
                for (let key in fields) {
                    callbacks[key] = (value: any) => {
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
                                    state._resolves.map((resolve: any) => resolve());
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
            let values: any = {};
            for (let key in state) {
                const method = (callbacks as any)[key];
                values[key] = [state[key], method];
            }
            useEffect(() => {
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
        component.Fields = ({ value, children }: { value: any, children: any }) => {
            const fields = value;
            let keys = Object.keys(fields);
            let iterate = (index: number): any => {
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
                return React.createElement(component[key].Provider, { value }, iterate(index));
            };
            let result = iterate(0);
            return result;
        };
        component.Fields.displayName = component.name + ".Fields";
    };
}
