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
exports.Asset = void 0;
const Url_1 = require("./Url");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = require('fs');
class Asset {
    constructor(url) {
        this.url = url instanceof Url_1.Url ? url : new Url_1.Url(url);
        this.data = null;
        this.loaded = false;
    }
    getUrl() {
        return this.url;
    }
    getData() {
        return this.data;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                const response = yield (0, node_fetch_1.default)(this.url.toString());
                this.data = yield response.buffer();
                this.loaded = true;
            }
            return this;
        });
    }
    save(path, filename = '') {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.loaded) {
                yield this.load();
            }
            if (this.data == null) {
                throw new Error('Data is null');
            }
            const filePath = path + (filename == '' ? this.url.getFilename() : filename);
            console.log(filePath);
            const fileStream = fs.createWriteStream(filePath);
            yield fileStream.write(this.data);
            fileStream.end();
            return this;
        });
    }
}
exports.Asset = Asset;
