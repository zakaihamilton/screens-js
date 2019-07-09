"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const screens_1 = __importDefault(require("../../../lib/screens"));
screens_1.default.CoreHttp = function () {
    this.me.CoreState.define({
        CoreHttp: {
            req: null,
            res: null
        }
    });
};
screens_1.default.CoreHttp.init = function () {
    let routes = this.me.CoreRoute;
    const server = http.createServer((req, res) => {
        let session = this.me.CoreObject.create({
            CoreHttp: {
                req,
                res
            }
        });
        const url = req.url;
        routes.notify(session, url, req, res);
    });
    let port = process.env.PORT || 8080;
    server.listen(port);
    this.register = this.me.CoreRoute.register;
};
