fs = require('fs');

var crawler = require('./modules/crawler.js');



/* Crawling sitemap */
/*
let startingUrl = "https://www.blizzard.com"

crawler.run(startingUrl, "sitemap", (sitemap) => {
    fs.writeFile('./sitemap.xml', sitemap, 'utf8', function (err) {
        if (err) return console.log(err);
    })
})
*/

/* Downloading all site */
/*
let startingUrl = "https://www.luxor.cz"

crawler.run(startingUrl, "downloadsite", { folder: "./download/" }, () => {
    console.log("Finish")
})
*/


let startingUrl = "https://ceskamincovna.cz/darky-389-p/"

crawler.run(startingUrl, "downloadassets", { folder: "./download/", extensions: ['jpg', 'jpeg', 'png', 'gif'] }, () => {
    console.log("Finish")
})