export class Page {
    url: string
    data: string
    loaded: boolean
    origin: string

    constructor(url: string) {
        this.url = url
        this.data = ''
        this.loaded = false
        this.origin = ''
    }

}