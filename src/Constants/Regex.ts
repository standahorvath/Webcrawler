// Description: Regex constants

// Absolute url Regex - Match absolute url, case insensitive, match in middle of code
export const absoluteUrl = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(\)]*[-A-Z0-9+&@#\/%=~_|])/gi

// Absolute url Exact Regex - Match absolute url, case insensitive, exact match only (no match in middle of code)
export const absoluteUrlExact = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9-]+\.)+(?:[a-z]{2,}\.?)))(?::\d{2,5})?(?:[/?#]\S*)?$/i

// Path name from url Regex - Match path name from url
export const pathNameFromUrl = /(?:\w+:)?\/\/[^\/]+([^?#]+)/

// Email Regex - Match email, case insensitive, match in middle of code
export const email =       /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/gi

// Email Exact Regex - Match email, case insensitive, exact match only (no match in middle of code)
export const emailExact = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi

// Relative url Regex - Match relative url, case insensitive, match in middle of code
export const relativeUrl = /(?:url\(|<(?:a|link|script|img)[^>]+(?:src|href)\s*=\s*)(?!['"]?(?:data|http))['"]?([^'"\)\s>]+)/gi

// Relative links Regex - Match relative links, only links, case insensitive, match in middle of code
export const relativeLinks = /(?:url\(|<(?:a)[^>]+(?:href)\s*=\s*)(?!['"]?(?:http))['"]?([^'"\)\s>]+)/gi

// Meta tag Regex - Match meta tag, case insensitive, match in middle of code
export const metaTag = /<meta[^>]+>/gi

// Title tag regex - Match title tag, case insensitive, match in middle of code
export const titleTag = /<title[^>]*>([^<]+)<\/title>/gi

// Get image tags missing alt atribute
// example <img src="image.jpg"> 
export const imagesWithoutAlt = /<img\b(?![^>]*\balt=)[^>]*>/gi

// Get all heading tags, from H1 to H6
export const headingTags = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi