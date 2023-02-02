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
let startingUrl = "https://musescore.com/user/38235231/scores/2933781"

crawler.run(startingUrl, "downloadsite", { folder: "./download/" }, () => {
    console.log("Finish")
})
*/


let startingUrl = "https://musescore.com/sitemap_scores10.xml" 

crawler.run(startingUrl, "downloadassets", { folder: "./download/", extensions: ['svg'] }, ({ links, assets }) => {
    /*
    fs.writeFile('./download/sitemap.xml', links.toSitemap(), 'utf8', function(err) {
        if (err) return console.log(err);
    })
    */

    console.log("Finish")
})
 