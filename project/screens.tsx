import screens from "../lib/screens"

screens.startup().then(() => {
    console.log("init complete");
    screens.CoreHttp.register(/^\/$/, async function (me: any) {
        await me.UIRender.component();
    });
});
