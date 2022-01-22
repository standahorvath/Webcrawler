fs = require('fs');

var crawler = require('./modules/crawler.js');



let startingUrl = "https://signi.com"

try {
  
    crawler.run(startingUrl, "sitemap", (sitemap) => {
        fs.writeFile('./registav.xml', sitemap, 'utf8', function (err) {
            if (err) return console.log(err);
        })
    })

  } catch (error) {
    console.error(error);
  }
