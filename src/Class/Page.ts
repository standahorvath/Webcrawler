import { Url } from './Url'
import fetch from 'node-fetch'
import { absoluteUrl, relativeUrl } from '../Constants/Regex'
export class Page {
    url: Url
    data: string | null
    loaded: boolean
    links: Url[]
    files: Url[]

    constructor(url: string | Url) {
        this.url = url instanceof Url ? url : new Url(url)
        this.data = null
        this.loaded = false
        this.links = [] as Url[]
        this.files = [] as Url[]
    }
    /**
     *  Method loads page and returns promise with loaded page
     * @param param0  {onload: (page: Page) => void} Callback function that is called when page is loaded 
     * @returns
     */
    public async load({ onload = (page: Page) => { } } = {}): Promise<Page> {
        if (!this.loaded) {
            const response = await fetch(this.url.toString())
            this.data = await response.text()
            this.loaded = true

            const processedData = this.processData() || { links: [], files: [] }
            this.links = processedData.links
            this.files = processedData.files

            onload(this)
        }
        return this
    }

    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    private processData(): { links: Url[], files: Url[] } | null {
        if (this.data == null) return null
        const absoluteLinks = this.processAbsoluteLinks() || [] as Url[]
        const relativeLinks = this.processRelativeLinks() || [] as Url[]
        const allLinks = [...absoluteLinks, ...relativeLinks]

        return {
            links: allLinks.filter((url) => url.isValid && url.isPage),
            files: allLinks.filter((url) => url.isValid && url.isAsset)
        }
    }

    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    private processAbsoluteLinks(): Array<Url> | null {
        if (this.data == null) return null

        return [...this.data.matchAll(absoluteUrl)].map((match) => {
            const url = new Url(match[0])
            return url
        })
    }

    /**
     *  Method returns array of Url objects
     * @returns {Url[]} Returns array of Url objects
     */
    private processRelativeLinks(): Array<Url> | null {
        if (this.data == null) return null

        return [...this.data.matchAll(relativeUrl)].map((match) => {
            const path = match[1].startsWith('/') ? match[1] : this.url.getPath() + '/' + match[1]
            const url = new Url(this.url.getOrigin() + path)
            return url
        })
    }

}