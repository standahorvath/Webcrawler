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

let startingUrl = "https://www.blizzard.com"

crawler.run(startingUrl, "sitemap", (sitemap) => {
    fs.writeFile('./sitemap.xml', sitemap, 'utf8', function (err) {
        if (err) return console.log(err);
    })
})