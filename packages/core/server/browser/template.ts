(function (exports: any, require: any) {
    //body//
}).call(document, {}, (path: any) => {
    let name = path.split("/").pop();
    if (name === "react-dom") {
        return ReactDOM;
    }
    if (name === "react") {
        return React;
    }
    return (document as any)[name];
});
