const Webqueue = require('./webqueue.js')
const Webpage = require('./webpage.js')

module.exports = {
    run: function (url, purpose, save) {
        if (typeof this[purpose] == "function") {
            this[purpose](url, save) 
        }
    },
    sitemap: async function (url, callback = null) {
        let webqueue = new Webqueue()
        let webpage = new Webpage(url)
        webqueue.enqueue(url)

        webpage.load((content) => {
            let localLinks = webpage.getLocalLinks(true, null)
            let absoluteLinks = webpage.getAbsoluteLinks(true, null)
            webqueue.enqueue(localLinks)
            webqueue.enqueue(absoluteLinks)

            webqueue.loadAll(() => {
                let sitemap = webqueue.toSitemap()
                if (callback !== null && typeof callback == "function") {
                    callback(sitemap)
                }
            }, true, true, 3)

        })
    },
}
