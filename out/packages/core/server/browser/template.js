"use strict";
(function (exports, require) {
    //body//
}).call(document, {}, (path) => {
    let name = path.split("/").pop();
    if (name === "react-dom") {
        return ReactDOM;
    }
    if (name === "react") {
        return React;
    }
    return document[name];
});
//# sourceMappingURL=template.js.map