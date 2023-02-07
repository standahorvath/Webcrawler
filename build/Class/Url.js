"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const Regex_1 = require("../Constants/Regex");
class Url {
    constructor(url) {
        this._url = url;
        this.isValid = Regex_1.absoluteUrlExact.test(url);
        if (this.isValid) {
            this._protocol = Url.extractProtocol(this._url);
            this._host = Url.extractHost(this._url);
            this._origin = this._protocol && this._host ? this._protocol + this._host : null;
            this._path = Url.extractPath(this._url);
            this._query = Url.extractQuery(this._url) || [];
            this._hash = Url.extractHash(this._url);
            this._filename = Url.extractFilename(this._url);
            this.isPage = Url.isPage(this._url);
            this.isAsset = Url.isAsset(this._url);
        }
        else {
            this._protocol = null;
            this._host = null;
            this._origin = null;
            this._path = null;
            this._query = [];
            this._hash = null;
            this._filename = null;
            this.isPage = false;
            this.isAsset = false;
        }
    }
    toString() {
        return this._url;
    }
    getFullUrl() {
        return this._url;
    }
    /**
     * Method returns host of url for example: domain.com
     * @returns {string|null} Returns host of url
     */
    getHost() {
        return this._host;
    }
    /**
     *  Method returns protocol of url for example: http:// or https://
     * @returns {string|null} Returns protocol of url
     */
    getProtocol() {
        return this._protocol;
    }
    /**
     *  Method returns origin of url for example: http://domain.com or https://domain.com
     * @returns {string|null} Returns origin of url
     */
    getOrigin() {
        return this._origin;
    }
    /**
     *  Method returns path of url for example: /path/to/file
     * @returns {string|null} Returns path of url
     */
    getPath() {
        return this._path;
    }
    /**
     *  Method returns query of url as array of objects
     * @returns {QueryValue[]} Returns query of url as array of objects
     */
    getQuery() {
        return this._query;
    }
    /**
     *  Method returns hash of url for example: #hash
     * @returns {string|null} Returns hash of url
     */
    getHash() {
        return this._hash;
    }
    /**
     * Method returns filename of url for example: file.ext
     * @returns {string|null} Returns filename of url
     */
    getFilename() {
        return this._filename;
    }
    // Method returns hash of url
    static extractHash(url) {
        if (url.includes('#')) {
            const pieces = url.split('#');
            if (pieces.length > 1) {
                if (pieces[1].includes('?')) {
                    return pieces[1].split('?')[0];
                }
                return pieces[1];
            }
        }
        return null;
    }
    // Method returns query of url as array of objects
    static extractQuery(url) {
        if (url.includes('?')) {
            const query = url.split('?')[1];
            const queryArray = query.split('&');
            const queryObjectArray = [];
            queryArray.forEach((queryItem) => {
                const queryItemArray = queryItem.split('=');
                const queryItemObject = {};
                queryItemObject[queryItemArray[0]] = queryItemArray[1] ? queryItemArray[1] : '';
                if (queryItemArray[1] && queryItemArray[1].includes('#')) {
                    queryItemObject[queryItemArray[0]] = queryItemArray[1].split('#')[0];
                }
                queryObjectArray.push(queryItemObject);
            });
            return queryObjectArray;
        }
        return null;
    }
    // Method returns filename of url
    static extractFilename(url) {
        if (url.includes('/')) {
            url = url.split('?')[0];
            url = url.split('#')[0];
            const pieces = url.split('/');
            if (pieces.length > 1) {
                let filename = pieces[pieces.length - 1];
                if (filename.includes('.')) {
                    return filename;
                }
                return null;
            }
        }
        return null;
    }
    // Method returns path of url
    static extractPath(url) {
        if (Regex_1.pathNameFromUrl.test(url) && Regex_1.pathNameFromUrl !== null) {
            const pathNameMatches = url.match(Regex_1.pathNameFromUrl);
            if (!pathNameMatches)
                return null;
            if (!pathNameMatches.length)
                return null;
            const pathName = pathNameMatches.pop();
            return pathName ? pathName : null;
        }
        return null;
    }
    // Method returns origin of url
    static extractOrigin(url) {
        if (url.includes('://')) {
            return url.split('://')[0] + '://' + url.split('://')[1].split('/')[0];
        }
        return null;
    }
    // Method returns host of url
    static extractHost(url) {
        if (url.includes('://')) {
            return url.split('://')[1].split('/')[0];
        }
        return null;
    }
    // Method returns protocol of url
    static extractProtocol(url) {
        if (url.includes('://')) {
            return url.split('://')[0] + '://';
        }
        return null;
    }
    // Method returns true if url is page
    static isPage(url) {
        return Url.extractFilename(url) === null;
    }
    // Method returns true if url is asset
    static isAsset(url) {
        return Url.extractFilename(url) !== null;
    }
}
exports.Url = Url;
