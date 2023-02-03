import { absoluteUrl } from "./Constants/Regex"

let test = '<script crossorigin="anonymous" defer="defer" type="application/javascript" src="https://github.githubassets.com/assets/wp-runtime-fc4889327711.js?v=1.1"></script>'

console.log(absoluteUrl.test(test))