const urlContent = require('url-content');
const http = require('http');
const https = require('https');
const regex = require('./regex.js')
const fs = require("fs");

function Webasset(url) {

    if (!(this instanceof Webasset)) {
        return new Webasset(url);
    }
    this.url = url;
    this.content = "";
    this.loaded = false;
    this.loading = false;
    this.valid = true;
    this.downloadFolder = "./download"
    this.used = false;
};

Webasset.prototype.getFolderPath = function getFolderPath() {
    // Make folder path from url path
    let indexFolder = this.url.replace(this.getOrigin(), "")
        // If path starts with / then remove it, we dont need it
    while (indexFolder.startsWith("/")) {
        indexFolder = indexFolder.substring(1)
    }
    indexFolder = indexFolder.replace(new RegExp("\\?", 'g'), '__')
    indexFolder = indexFolder.replace(new RegExp("=", 'g'), '-')
    return indexFolder
};

Webasset.prototype.setDownloadFolder = function setDownloadFolder(folder) {
    this.downloadFolder = folder
};

Webasset.prototype.isValid = function isValid() {
    return this.valid
};

Webasset.prototype.getOrigin = function isValid() {
    let origin = ""
    let splittedUrl = this.url.split("/")
    if (splittedUrl.length >= 2) {
        for (let i = 0; i < 3; i++) {
            if (i !== 2) {
                origin += splittedUrl[i] + "/"
            } else {
                origin += splittedUrl[i]
            }
        }
    } else {
        origin = this.url
    }
    return origin
};

Webasset.prototype.compare = function compare(compareUrl) {
    let w_url = this.url
    let t_url = ""
    if (typeof compareUrl == "string") {
        t_url = compareUrl
    } else {
        if (typeof compareUrl.url !== "undefined") {
            t_url = compareUrl.url
        }
    }
    if (!t_url.endsWith("/")) t_url += "/"
    if (!w_url.endsWith("/")) w_url += "/"
    w_url = w_url.toLowerCase()
    t_url = t_url.toLowerCase()
    return w_url == t_url
};

Webasset.prototype.load = function load(callback, failed = null) {
    this.loading = true

    try {

        if (this.url.startsWith("https")) {
            const request = https.get(this.url, (res) => {
                const writeStream = fs.createWriteStream(this.downloadFolder + this.getFilename());
                res.pipe(writeStream);
                writeStream.on("finish", () => {
                    writeStream.close()
                    this.loaded = true
                    callback(null, this)
                });
            });

            request.on("error", () => {
                if (failed !== null) failed("error", this)
            });
        } else {
            const request = http.get(this.url, (res) => {
                const writeStream = fs.createWriteStream(this.downloadFolder + this.getFilename());
                res.pipe(writeStream);
                writeStream.on("finish", () => {
                    writeStream.close()
                    this.loaded = true
                    callback(null, this)
                });
            });

            request.on("error", () => {
                if (failed !== null) failed("error", this)
            });
        }

    } catch (exception) {
        if (failed !== null) failed(exeption, this)
    }

    /*
    urlContent.getContent(this.url).then(content => {
        this.content = content
        this.loaded = true
        callback(content, this)
    }, reason => {
        this.valid = false
        if (failed !== null) {
            failed(reason, this)
        }
    }).catch(error => {
        this.valid = false
        if (failed !== null) {
            failed(error, this)
        }
    });
    */

};

Webasset.prototype.getFilename = function(withQuery = false) {
    let slicedUrl = withQuery ? this.url.split("/") : this.url.split("?")[0].split("/")
    let filename = slicedUrl[slicedUrl.length - 1]
    return filename

}


module.exports = Webasset;