import { absoluteUrlExact, pathNameFromUrl } from '../Constants/Regex'
export class Url {
    private _url: string

    private _host: null|string               // domain.com
    private _protocol: null|string           // http:// or https://
    private _origin: null|string                      // http://domain.com or https://domain.com
    private _path: null|string                        // /path/to/file
    private _query: QueryValue[]                 // ?key=value&key2=value2
    private _hash: null|string                    // #hash

    public isValid: boolean

    constructor(url: string) {
        this._url = url
        this.isValid = absoluteUrlExact.test(url)

        if (this.isValid) {
            this._protocol = Url.extractProtocol(this._url)
            this._host = Url.extractHost(this._url)
            this._origin = this._protocol && this._host ? this._protocol + this._host : null
            this._path = Url.extractPath(this._url)
            this._query = Url.extractQuery(this._url) || []
            this._hash = Url.extractHash(this._url) || ''
        } else {
            this._protocol = null
            this._host = null
            this._origin = null
            this._path = null
            this._query = []
            this._hash = ''
        }

    }

    public getFullUrl(): string {
        return this._url
    }
    /**
     * Method returns host of url for example: domain.com
     * @returns {string|null} Returns host of url
     */
    public getHost(): string|null {
        return this._host
    }
    /**
     *  Method returns protocol of url for example: http:// or https://
     * @returns {string|null} Returns protocol of url
     */
    public getProtocol(): string|null {
        return this._protocol
    }
    /**
     *  Method returns origin of url for example: http://domain.com or https://domain.com
     * @returns {string|null} Returns origin of url
     */
    public getOrigin(): string|null {
        return this._origin
    }
    /**
     *  Method returns path of url for example: /path/to/file
     * @returns {string|null} Returns path of url
     */
    public getPath(): string|null {
        return this._path
    }
    /**
     *  Method returns query of url as array of objects
     * @returns {QueryValue[]} Returns query of url as array of objects
     */
    public getQuery(): QueryValue[] {
        return this._query
    }
    /**
     *  Method returns hash of url for example: #hash
     * @returns {string|null} Returns hash of url
     */
    public getHash(): string|null {
        return this._hash
    }

    // Method returns hash of url
    public static extractHash(url:string): string|null {
        if(url.includes('#')) {
            const pieces = url.split('#')
            if(pieces.length > 1) {
                if(pieces[1].includes('?')) {
                    return pieces[1].split('?')[0]
                }
                return pieces[1]
            }
        }
        return null
    }

    // Method returns query of url as array of objects
    public static extractQuery(url:string): Array<QueryValue>|null {
        if(url.includes('?')) {
            const query = url.split('?')[1]
            const queryArray = query.split('&')
            const queryObjectArray = [] as Array<QueryValue>
            queryArray.forEach((queryItem) => {
                const queryItemArray = queryItem.split('=')
                const queryItemObject: QueryValue = {}
                queryItemObject[queryItemArray[0]] = queryItemArray[1] ? queryItemArray[1] : ''
                queryObjectArray.push(queryItemObject)
            })
            return queryObjectArray
        }
        return null
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