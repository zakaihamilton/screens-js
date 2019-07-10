import * as http from "http";
import screens from "../../../lib/screens";

screens.CoreHttp = function () {
    this.me.CoreState.define({
        CoreHttp: {
            req: null,
            res: null
        }
    });
};

screens.CoreHttp.init = function () {
    let routes = this.me.CoreRoute;
    const server = http.createServer((req, res) => {
        let session = this.me.CoreObject.create({
            CoreHttp: {
                req,
                res
            }
        });
        routes.notify(req.url, session.me);
    });
    let port = process.env.PORT || 8080;
    server.listen(port);
    this.register = this.me.CoreRoute.register;
};
