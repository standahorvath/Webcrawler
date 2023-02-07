"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCrawler = void 0;
class BaseCrawler {
    constructor(settings) {
        this._pages = [];
        this._assets = [];
        this._settings = settings;
    }
    run() {
        console.log('Running crawler');
        return Promise.resolve();
    }
}
exports.BaseCrawler = BaseCrawler;
