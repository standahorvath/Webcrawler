"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const Url_1 = require("./Url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const Regex_1 = require("../Constants/Regex");
class Page {
    constructor(url) {
        this.url = url instanceof Url_1.Url ? url : new Url_1.Url(url);
        this.data = null;
        this.loaded = false;
        this.links = [];
        this.files = [];
    }
    /**
     *  Method loads page and returns promise with loaded page
     * @param param0  {onload: (page: Page) => void} Callback function that is called when page is loaded
     * @returns
     */
    load({ onload = (page) => { } } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                const response = yield (0, node_fetch_1.default)(this.url.toString());
                this.data = yield response.text();
                this.loaded = true;
                const processedData = this.processData() || { links: [], files: [] };
                this.links = processedData.links;
                this.files = processedData.files;
                onload(this);
            }
            return this;
        });
    }
    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    processData() {
        if (this.data == null)
            return null;
        const absoluteLinks = this.processAbsoluteLinks() || [];
        const relativeLinks = this.processRelativeLinks() || [];
        const allLinks = [...absoluteLinks, ...relativeLinks];
        return {
            links: allLinks.filter((url) => url.isValid && url.isPage),
            files: allLinks.filter((url) => url.isValid && url.isAsset)
        };
    }
    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    processAbsoluteLinks() {
        if (this.data == null)
            return null;
        return [...this.data.matchAll(Regex_1.absoluteUrl)].map((match) => {
            const url = new Url_1.Url(match[0]);
            return url;
        });
    }
    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    processRelativeLinks() {
        if (this.data == null)
            return null;
        return [...this.data.matchAll(Regex_1.relativeUrl)].map((match) => {
            const path = match[1].startsWith('/') ? match[1] : this.url.getPath() + '/' + match[1];
            const url = new Url_1.Url(this.url.getOrigin() + path);
            return url;
        });
    }
}
exports.Page = Page;
