const Webqueue = require('./webqueue.js')
const Webpage = require('./webpage.js')

module.exports = {
    run: function(url, purpose, options, callback) {
        if (typeof this[purpose] == "function") {
            this[purpose](url, options, callback)
        }
    },
    downloadassets: async function(url, options, callback = null) {

        let webqueue = new Webqueue() // queue for source (html)
        let assetsWebqueue = new Webqueue() // queue for assets (css, js, jpg, jpeg, svg)
        let webpage = new Webpage(url) // root page


        webpage.load((content) => {

            let localLinks = webpage.getLocalLinks(true, null)
            let absoluteLinks = webpage.getAbsoluteLinks(true, null)
            let assetLinks = []
            webqueue.enqueue(localLinks)
            webqueue.enqueue(absoluteLinks)
            assetLinks = webpage.getAssets(false, options.extensions)
            assetsWebqueue.enqueue(assetLinks, "asset")


            while(webqueue.hasItemsToLoad()){

            /* Load links */
            for (let i = 0; i < webqueue.queue.length; i++) {

                if (!webqueue.queue[i].isValid()) continue

                assetLinks = webqueue.queue[i].getAssets(false, options.extensions)
                assetsWebqueue.enqueue(assetLinks, "asset")

            }
            
            for (let i = 0; i < assetsWebqueue.queue.length; i++) {

                if (!assetsWebqueue.queue[i].isValid()) continue

                let dir = options.folder
                    // If directory doesnt ends with / then adds it
                if (!dir.endsWith("/")) dir += "/"

                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                assetsWebqueue.queue[i].setDownloadFolder(dir)
            }

            // Load all assets
            assetsWebqueue.loadAll(() => {
                
            }, false, false, 16)

            /* Load links end */

            webqueue.loadAll(() => {
                for (let i = 0; i < webqueue.queue.length; i++) {

                    if (!webqueue.queue[i].isValid()) continue

                    assetLinks = webqueue.queue[i].getAssets(false, options.extensions)
                    assetsWebqueue.enqueue(assetLinks, "asset")

                }
            })

            }

            

            /*
            // Download all source codes
            webqueue.loadAll(() => {
                for (let i = 0; i < webqueue.queue.length; i++) {

                    if (!webqueue.queue[i].isValid()) continue

                    assetLinks = webqueue.queue[i].getAssets(true, options.extensions)
                    assetsWebqueue.enqueue(assetLinks, "asset")

                }


                for (let i = 0; i < assetsWebqueue.queue.length; i++) {

                    if (!assetsWebqueue.queue[i].isValid()) continue

                    let dir = options.folder
                        // If directory doesnt ends with / then adds it
                    if (!dir.endsWith("/")) dir += "/"

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    assetsWebqueue.queue[i].setDownloadFolder(dir)


                }


                // Load all assets
                assetsWebqueue.loadAll(() => {
                    console.log("Download finished")
                }, false, false, 16)



            }, true, true, 16)
            */

        })


        if (callback !== null && typeof callback == "function") {
            callback()
        }
    },
    downloadsite: async function(url, options, callback = null) {

        let webqueue = new Webqueue() // queue for source (html)
        let assetsWebqueue = new Webqueue() // queue for assets (css, js, jpg, jpeg, svg)
        let webpage = new Webpage(url) // root page

        webqueue.enqueue(url)

        webpage.load((content) => {

            let localLinks = webpage.getLocalLinks(true, null)
            let absoluteLinks = webpage.getAbsoluteLinks(true, null)
            webqueue.enqueue(localLinks)
            webqueue.enqueue(absoluteLinks)

            let assetLinks = webpage.getAssets(true)
            assetsWebqueue.enqueue(assetLinks, "asset")

            // Download all source codes
            webqueue.loadAll(() => {
                for (let i = 0; i < webqueue.queue.length; i++) {

                    if (!webqueue.queue[i].isValid()) continue

                    let dir = options.folder
                        // If directory doesnt ends with / then adds it
                    if (!dir.endsWith("/")) dir += "/"

                    // Make folder path from url path
                    let indexFolder = webqueue.queue[i].getFolderPath()


                    // put together
                    dir += indexFolder

                    // if path doesnt have slash at and, then add it
                    if (!dir.endsWith("/")) dir += "/"

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    // Save into folder as html
                    fs.writeFile(dir + "index.html", webqueue.queue[i].getRelativeContent(), 'utf8', function(err) {
                        if (err) return console.log(err);
                    })


                    assetLinks = webqueue.queue[i].getAssets(true)
                    assetsWebqueue.enqueue(assetLinks, "asset")

                }


                for (let i = 0; i < assetsWebqueue.queue.length; i++) {

                    if (!assetsWebqueue.queue[i].isValid()) continue

                    let dir = options.folder
                        // If directory doesnt ends with / then adds it
                    if (!dir.endsWith("/")) dir += "/"

                    // Make folder path from url path
                    let indexFolder = assetsWebqueue.queue[i].getFolderPath()

                    // put together
                    dir += indexFolder

                    // if path doesnt have slash at and, then add it
                    if (!dir.endsWith("/")) dir += "/"

                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }

                    assetsWebqueue.queue[i].setDownloadFolder(dir)


                }


                // Load all assets
                assetsWebqueue.loadAll(() => {
                    console.log("Download finished")
                }, false, false, 16)



            }, true, true, 16)

        })


        if (callback !== null && typeof callback == "function") {
            callback()
        }
    },
    sitemap: async function(url, options, callback = null) {
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
            }, true, true, 16)

        })
    },
}