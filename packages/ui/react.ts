import screens from "../../lib/screens";
import React, { useRef, useEffect } from 'react';

screens.UIReact = function () {

};

screens.UIReact.static = function () {
    this.useObject = function () {
        let ref: any = useRef(null);
        let object: any = ref.current;
        if (!object) {
            object = ref.current = {};
            screens.objectify(object, "UIReact");
        }
        useEffect(() => {
            return () => {
                object.me.CoreObject.destroy();
            };
        }, []);
        object.me.CoreListener.notify("UIReact", "render");
        return object;
    };
    this.classes = function (classes: any) {
        let string = "";
        for (let key in classes) {
            let value = classes[key];
            if (value) {
                string += key + " ";
            }
        }
        return string.trim();
    }
    this.styles = function (styles: any) {
        Object.keys(styles).forEach(key => styles[key] === undefined && delete styles[key]);
        return styles;
    }
}
