import { absoluteUrlExact, pathNameFromUrl } from '../Constants/Regex'
export class Url {
    private _url: string

    private _host: null|string               // domain.com
    private _protocol: null|string           // http:// or https://
    private _origin: null|string                      // http://domain.com or https://domain.com
    private _path: null|string                        // /path/to/file
    private _query: string[]                 // ?key=value&key2=value2
    private _hash: ''                        // #hash

    public isValid: boolean

    constructor(url: string) {
        this._url = url
        this.isValid = absoluteUrlExact.test(url)

        if (this.isValid) {
            this._protocol = Url.extractProtocol(this._url)
            this._host = Url.extractHost(this._url)
            this._origin = this._protocol ? this._protocol : '' + this._host ? this._host : ''
            this._path = Url.extractPath(this._url)
        } else {
            this._protocol = null
            this._host = null
            this._origin = null
            this._path = null
        }

    }

    public getFullUrl(): string {
        return this._url
    }

    // Method returns path of url
    public static extractPath(url:string): string|null {
        if(pathNameFromUrl.test(url) && pathNameFromUrl !== null) {
            const pathNameMatches = url.match(pathNameFromUrl)
            if(!pathNameMatches) return null
            if(!pathNameMatches.length) return null
            const pathName = pathNameMatches.pop()
            return pathName ? pathName : null
        }
        return null
    }

    // Method returns origin of url
    public static extractOrigin(url:string): string|null {
        if(url.includes('://')) {
            return url.split('://')[0] + '://' + url.split('://')[1].split('/')[0]
        }
        return null
    }

    // Method returns host of url
    public static extractHost(url:string): string|null {
        if(url.includes('://')) {
            return url.split('://')[1].split('/')[0]
        }
        return null
    }

    // Method returns protocol of url
    public static extractProtocol(url:string): string|null {
        if(url.includes('://')) {
            return url.split('://')[0] + '://'
        }
        return null
    }
}