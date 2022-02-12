const Webpage = require('./webpage.js')
const Webasset = require('./webasset.js')
const fs = require('fs')

function Webqueue() {

    if (!(this instanceof Webqueue)) {
        return new Webqueue();
    }
    this.queue = [];
    this.usedThreads = 0;
};

Webqueue.prototype.log = function log() {
    console.log(this.queue)
};

Webqueue.prototype.hasItemsToLoad = function hasItemsToLoad() {
    // Foreach all of queue WebPages
    for (let i = 0; i < this.queue.length; i++) {
        // If is webpage valid and not loaded
        if (!this.queue[i].loaded && !this.queue[i].loading && this.queue[i].isValid()) {
            return true
        }
    }
    return false
};

Webqueue.prototype.clearCache = function clearCache() {
    // Foreach all of queue WebPages
    for (let i = 0; i < this.queue.length; i++) {
        // If is webpage valid and not loaded
        if (this.queue[i].loaded && this.queue[i].isValid()) {
            this.queue[i].content = ""
        }
    }
    return false
};

/**
 * Methods that download all of source in queue; can discover new links and download them too, this can be controlled by params
 * @param {function} callback Functions what is called after all is downloaded
 * @param {bool} followNewLinks If true then downloader follow discovered links
 * @param {bool} sameOrigin If true then downloader keeps downloading in same origin (same site)
 * @param {number} threads Number of allowed paralel threads 
 */
Webqueue.prototype.loadAll = function loadAll(callback = null, followNewLinks = false, sameOrigin = true, threads = 3) {
    // Create all of threads
    this.usedThreads = 0
    while (this.usedThreads < threads) {
        this.createThread(callback, followNewLinks, sameOrigin, this.usedThreads, true)
        this.usedThreads++
    }
};

/**
 * Method that create one single thread of downloading by rules in parameters
 * @param {function} callback Function what is called after all of websites are downloaded (after active threads are zero)
 * @param {bool} followNewLinks If true then downloader follow discovered links
 * @param {bool} sameOrigin If true then downloader keeps downloading in same origin (same site)
 * @returns Void
 */
Webqueue.prototype.createThread = function createThread(callback = null, followNewLinks = false, sameOrigin = true, threadID = 0, debug = false) {

    // Foreach all of queue WebPages
    for (let i = 0; i < this.queue.length; i++) {
        // If is webpage valid and not loaded
        if (!this.queue[i].loaded && !this.queue[i].loading && this.queue[i].isValid()) {
            // then download it
            if (debug) console.log("\x1b[32m[Thread " + threadID + "/" + this.usedThreads + "][Request] \x1b[37m" + this.queue[i].url)
            this.queue[i].load((content, webpage) => {
                // Success
                let localLinks = []
                let absoluteLinks = []
                    // if is folow new links enabled
                if (followNewLinks) {
                    // if keep in same origin
                    localLinks = webpage.getLocalLinks(true, null)
                    absoluteLinks = webpage.getAbsoluteLinks(sameOrigin, null)
                    this.enqueue(localLinks)
                    this.enqueue(absoluteLinks)
                }
                if (debug) console.log("\x1b[32m[Thread " + threadID + "/" + this.usedThreads + "][Downloaded] \x1b[37m" + webpage.url + "\x1b[33m found " + (localLinks.length + absoluteLinks.length) + " links")
                this.createThread(callback, followNewLinks, sameOrigin, threadID, debug)
            }, (reason, webpage) => { // TODO FAILED
                if (debug) console.log("\x1b[31m[Thread " + threadID + "/" + this.usedThreads + "][Failed] \x1b[37m" + webpage.url)
                console.log(reason)
                this.createThread(callback, followNewLinks, sameOrigin, threadID, debug)
            })
            return
        }
    }

    this.usedThreads--
        if (false) console.log("\x1b[32m[Threads] \x1b[37m" + this.usedThreads)
    if (this.usedThreads == 0) {
        callback()
    }
};

Webqueue.prototype.enqueue = function enqueue(url = [], type = "webpage") {
    let t_web = null
    if (typeof url == "string") {
        if (type == "webpage") {
            t_web = new Webpage(url)
        } else if (type == "asset") {
            t_web = new Webasset(url)
        }
        if (t_web.isValid) {
            let found = false
            for (let i = 0; i < this.queue.length; i++) {
                if (this.queue[i].compare(url[j])) {
                    found = true
                }
            }
            if (!found) this.queue.push(t_web)
        }
    } else {
        for (let j = 0; j < url.length; j++) {
            if (type == "webpage") {
                t_web = new Webpage(url[j])
            } else if (type == "asset") {
                t_web = new Webasset(url[j])
            }
            if (t_web.isValid) {
                let found = false
                for (let i = 0; i < this.queue.length; i++) {
                    if (this.queue[i].compare(url[j])) {
                        found = true
                    }
                }
                if (!found) this.queue.push(t_web)
            }
        }
    }
};



Webqueue.prototype.toSitemap = function toSitemap() {

    let content = ""
    let data = "";
    try {
        data = fs.readFileSync('static/sitemapTemplate.xml', 'utf8')
    } catch (err) {
        console.error(err)
    }


    for (let i = 0; i < this.queue.length; i++) {
        if (this.queue[i].isValid()) {
            content += '<url>\r\n';
            content += '<loc>' + this.queue[i].url + '</loc>\r\n';
            content += '<lastmod>' + new Date().toISOString() + '</lastmod>\r\n';
            content += '<priority>' + (i == 0 ? '1.00' : '0.80') + '</priority>\r\n';
            content += '</url>\r\n';
        }
    }

    return data.replace("<urls>", content)
};


module.exports = Webqueue;