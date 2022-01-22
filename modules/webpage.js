const urlContent = require('url-content');
const regex = require('./regex.js')

function Webpage(url) {

  if (!(this instanceof Webpage)) {
    return new Webpage(url);
  }
  this.url = url;
  this.content = "";
  this.loaded = false;
  this.loading = false;
  this.valid = true;
};

Webpage.prototype.log = function log() {
  console.log(this.url)
};

Webpage.prototype.isValid = function isValid() {
  return this.valid
};


Webpage.prototype.getOrigin = function isValid() {
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

Webpage.prototype.compare = function compare(compareUrl) {
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

Webpage.prototype.load = function load(callback, failed = null) {
  this.loading = true
  urlContent.getContent(this.url).then(content => {
    this.content = content
    this.loaded = true
    callback(content, this)
  }, reason => {
    this.valid = false
    if(failed !== null){
      failed(reason, this)
    }
  }).catch(error => {
    this.valid = false
    if(failed !== null){
      failed(error, this)
    }
  });
};

/**
 * This function is for getting a local links on a webpage, it takes contain and find local links eg: /css/style.css
 * @param {bool} convertToAbsolute Bool if results must have domain prefix
 * @param {String/Array} extension String or array of extensions, allowed: *, .jpg, *.jpg, ['css', 'js'], null
 * @returns Returns array of absolute/relative links to local server
 */
Webpage.prototype.getLocalLinks = function getLocalLinks(convertToAbsolute = true, extension = '*') {
  // Take links from sourcecode
  let links = this.content.match(regex.localLinksRegex)


  let replace = ["\"", "'", "src=", "href="]
  for (let i = 0; i < links.length; i++) {

    // Clean the links from atributes
    for (let j = 0; j < replace.length; j++) {
      links[i] = links[i].replace(new RegExp(replace[j], 'g'), '')
    }

    // Remove hash #
    while (links[i].includes("#")) {
      links[i] = links[i].split("#")[0]
    }

    // Convert relative /abc to absolute link with https://www....
    if (convertToAbsolute) {
      if (links[i].startsWith("/")) {
        // if link = /abc then get origin and add link ...example.com/abc
        links[i] = this.getOrigin() + links[i]
      } else {
        if (this.url.endsWith("/")) {
          // if url ends with / = example.com/ and link doesnt start with / then result is ...example.com/abc
          links[i] = this.url + links[i]
        } else {
          if (this.url == this.getOrigin()) {
            // when we are on origin url and url doesnt ends with / then we can just stick it together with / => ...example.com/abc
            links[i] = this.url + "/" + links[i]
          } else {
            // else our url is examole.com/abc and we get link for example xyz then we need this result => example.com/xyz
            // split url by /
            let url_split = this.url.split("/")
            let build_link = ""
            // convert https://example.com/abc into https://example.com/
            for (let s = 0; s < url_split.length - 1; s++) {
              build_link += url_split[s] + "/"
            }
            // add link to end
            links[i] = build_link + links[i]

          }
        }
      }
    }
  }



  // Filter for some kind of extensions
  if (extension == null) {
    // null = means no extension
    let t_links = []
    for (let i = 0; i < links.length; i++) {
      if (convertToAbsolute) {
        if (links[i].match(regex.absolutePathWithExtension) == null) {
          t_links.push(links[i])
        }
      } else {
        if (links[i].match(regex.relativePathWithExtension) == null) {
          t_links.push(links[i])
        }
      }
    }

    // manifest results
    links = t_links
  }
  else if (extension !== "*") {
    // * = means no filter, skip this step
    let t_extensions = []
    let t_links = []

    // Check if extension is string or an array
    if (typeof extension == 'string') {
      // Push string to extensions array
      t_extensions.push(extension)
    } else {
      // or just replace with given array
      t_extensions = extension
    }

    // Filter the links
    for (let i = 0; i < links.length; i++) {
      let found = false
      for (let j = 0; j < t_extensions.length; j++) {
        if (links[i].includes("." + t_extensions[j].replace(".", "").replace("*", ""))) {
          found = true
        }
      }
      if (found) t_links.push(links[i])
    }

    // manifest results
    links = t_links

  }

  // return only unique elements
  return links.filter((value, index, self) => { return self.indexOf(value) === index });
};

/**
 * This methods take content and find all absolute links in it, can filter extensions and decide by same origin
 * @param {Bool} sameOrigin Bool atribute if method have to return only links with same origin
 * @param {String/Array} extension  String or array of extensions, allowed: *, .jpg, *.jpg, ['css', 'js'], null
 * @returns Return array of absolute links in source code
 */
Webpage.prototype.getAbsoluteLinks = function getAbsoluteLinks(sameOrigin = false, extension = '*') {
  let links = this.content.match(regex.absoluteLinksRegex)

  if (sameOrigin) {
    let t_links = []
    // Take origin from url
    //let origin = (this.url.replace("http://", "").replace("https://", "").split("/"))[0]

    // Filter links by origin inside the link
    for (let i = 0; i < links.length; i++) {
      if (links[i].startsWith(this.getOrigin())) {
        t_links.push(links[i])
      }
    }

    // manifest results
    links = t_links
  }



  // Filter for some kind of extensions
  if (extension == null) {
    // null = means no extension
    let t_links = []
    for (let i = 0; i < links.length; i++) {
      if (links[i].match(regex.absolutePathWithExtension) == null) {
        t_links.push(links[i])
      }
    }

    // manifest results
    links = t_links
  }
  else if (extension !== "*") {
    // * = means no filter, skip this step
    let t_extensions = []
    let t_links = []

    // Check if extension is string or an array
    if (typeof extension == 'string') {
      // Push string to extensions array
      t_extensions.push(extension)
    } else {
      // or just replace with given array
      t_extensions = extension
    }

    // Filter the links
    for (let i = 0; i < links.length; i++) {
      let found = false
      for (let j = 0; j < t_extensions.length; j++) {
        if (links[i].includes("." + t_extensions[j].replace(".", "").replace("*", ""))) {
          found = true
        }
      }
      if (found) t_links.push(links[i])
    }

    // manifest results
    links = t_links

  }

  // return only unique elements
  return links.filter((value, index, self) => { return self.indexOf(value) === index });
};

module.exports = Webpage;