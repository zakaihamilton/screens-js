import screens from "../lib/screens"

screens.startup().then(() => {
    console.log("init complete");
    screens.CoreHttp.register(/^\/$/, (req: any, resp: any) => {
        let headers = {
            "Content-Type": "text/html",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        };

        resp.writeHead(200, headers);
        resp.end(`<html><!DOCTYPE html><head></head><body>${new Date().toString()}</body></html>`);
    });
});
