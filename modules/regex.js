module.exports = {
    absoluteLinksRegex : /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9+&@#\/%=~_|])/gi,
    localLinksRegex : /(href|src)=["'][\/a-zA-Z0-9@\._\?=\-\&\#]{1,256}["']/gi,
    absolutePathWithExtension: /[\.a-zA-Z0-9@_\?=\-\&\#]+\/[a-zA-Z0-9@_\?=\-\&\#\(\)]+\.[a-zA-Z0-9@_\?=\-\&\#\.]+$/gm,
    relativePathWithExtension: /[a-zA-Z0-9@_\?=\-\&\#\(\)]+\.[a-zA-Z0-9@_\?=\-\&\#\.]+$/gm,
} 