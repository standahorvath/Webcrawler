# webcrawler
Multipurpose Webcrawler - Developer web tool

## How use it
Install and run

```console
npm install
npm run
```

Using as a sitemap generator

```js
// File write library
fs = require('fs');
// Web crawler instance
var crawler = require('./modules/crawler.js');

// url to index
let startingUrl = "https://www.blizzard.com"
// running the crawler
crawler.run(startingUrl, "sitemap", (sitemap) => {
    // saving output
    fs.writeFile('./sitemap.xml', sitemap, 'utf8', function (err) {
        if (err) return console.log(err);
    })
})
```