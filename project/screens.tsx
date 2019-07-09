import screens from "../lib/screens"

screens.startup().then(() => {
    console.log("init complete");
    screens.CoreHttp.register(/^\/$/, async function (this: any, req: any, res: any) {

    });
});
