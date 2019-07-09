"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const screens_1 = __importDefault(require("../lib/screens"));
screens_1.default.startup().then(() => {
    console.log("init complete");
    screens_1.default.CoreHttp.register(/^\/$/, (req, resp) => {
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
