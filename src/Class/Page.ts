import { Url } from './Url'
import fetch from 'node-fetch'
import { absoluteUrl, relativeUrl, titleTag, metaTag } from '../Constants/Regex'
export class Page {
    url: Url
    data: string | null
    code: number | null
    loaded: boolean
    links: Url[]
    files: Url[]
    _loadingStart: number
    _loadingEnd: number
    ttfb: number

    constructor(url: string | Url) {
        this.url = url instanceof Url ? url : new Url(url)
        this.data = null
        this.code = null
        this.loaded = false
        this.links = [] as Url[]
        this.files = [] as Url[]
        this._loadingStart = 0
        this._loadingEnd = 0
        this.ttfb = 0
    }
    public getUrl(): string {
        return this.url.toString()
    }
    public getUrlObject(): Url {
        return this.url
    }
    public getData(): string | null {
        return this.data
    }
    public getCode(): number | null {
        return this.code
    }
    public getLinks(): Url[] {
        return this.links
    }
    public getFiles(): Url[] {
        return this.files
    }
    /**
     *  Method loads page and returns promise with loaded page
     * @param param0  {onload: (page: Page) => void} Callback function that is called when page is loaded 
     * @returns
     */
    public async load({ onload = (page: Page) => { } } = {}): Promise<Page> {
        if (!this.loaded) {
            this._loadingStart = Date.now()
            try {
                const response = await fetch(this.url.toString())
                this.code = response.status
                this.data = await response.text()
                this.loaded = true
                this._loadingEnd = Date.now()
                this.ttfb = this._loadingEnd - this._loadingStart
    
                const processedData = this.processData() || { links: [], files: [] }
                this.links = processedData.links
                this.files = processedData.files

                onload(this)

            } catch (error) {
                console.log(error)
            }
        }

        return this
    }

    public getInternalLinks(): Url[] {
        return this.links.filter((url) => url.getHost() === this.url.getHost())
    }

    public getExternalLinks(): Url[] {
        return this.links.filter((url) => url.getHost() !== this.url.getHost())
    }

    public getTtfb(): number {
        return this.ttfb
    }

    public getLang(): string | null {
        if (!this.loaded || this.data == null) return null;
        const match = this.data.match(/<html(?:\s+[^>]*?)?\s+lang=["']([\w-]+)["']/i);
        if (match == null) return null;
        return match[1];
    }

    public getTitleTag(): string | null {
        if (!this.loaded || this.data == null) return null
        const match = this.data.match(titleTag)
        if (match == null) return null
        return match[0].replace(/<[^>]*>/g, '')
    }

    public getMetaTag(name: string): string | null {
        const metaTags = this.getMetaTags()
        const metaTag = metaTags.find((metaTag) => metaTag.name === name)
        return metaTag == null ? null : metaTag.content
    }

    public getMetaTags(): MetaTag[] {
        if (!this.loaded || this.data == null) return [] as MetaTag[]
        const matches = this.data.matchAll(metaTag)
        if (matches == null) return [] as MetaTag[]
        const metaTags: MetaTag[] = []

        for (const match of matches) {
            const nameAtribute = match[0].match(/name=["'](.*?)["']/)
            const nameAtributeValue = nameAtribute == null ? '' : nameAtribute[0].replace(/name=["']/, '').replace(/["']/, '')
            const contentAtribute = match[0].match(/content=["'](.*?)["']/)
            const contentAtributeValue = contentAtribute == null ? '' : contentAtribute[0].replace(/content=["']/, '').replace(/["']/, '')
            const propertyAtribute = match[0].match(/property=["'](.*?)["']/)
            const propertyAtributeValue = propertyAtribute == null ? '' : propertyAtribute[0].replace(/property=["']/, '').replace(/["']/, '')
            metaTags.push({
                name: nameAtributeValue,
                content: contentAtributeValue,
                property: propertyAtributeValue
            })
        }

        return metaTags
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
        let clearedData = this.data.replace(/<head(?:\s+[^>]*?)?>[\s\S]*?<\/head>/gi, '');
        clearedData = clearedData.replace(/<script(?:\s+[^>]*?)?(?:\s+type=(['"])(text\/javascript|application\/javascript)\1)?[\s\S]*?<\/script>/gi, '');
        clearedData = clearedData.replace(/<style(?:\s+[^>]*?)?(?:\s+type=(['"])(text\/css)\1|\s+id=['"]\w+['"])?[\s\S]*?<\/style>/gi, '');

        return [...clearedData.matchAll(absoluteUrl)].map((match) => {
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
        let clearedData = this.data.replace(/<head(?:\s+[^>]*?)?>[\s\S]*?<\/head>/gi, '');
        clearedData = clearedData.replace(/<script(?:\s+[^>]*?)?(?:\s+type=(['"])(text\/javascript|application\/javascript)\1)?[\s\S]*?<\/script>/gi, '');
        clearedData = clearedData.replace(/<style(?:\s+[^>]*?)?(?:\s+type=(['"])(text\/css)\1|\s+id=['"]\w+['"])?[\s\S]*?<\/style>/gi, '');

        return [...clearedData.matchAll(relativeUrl)].filter((match) => {
            const file = match[1]

            // Filter out some not real links
            if (file.startsWith('#')) return false
            if (file.startsWith('javascript:')) return false
            if (file.startsWith('mailto:')) return false
            if (file.startsWith('tel:')) return false
            if (file.startsWith('data:')) return false

            return true
        }).map((match) => {
            // match[1] is file path
            // /path/to/file
            let file = match[1]

            if (file.startsWith('./')) file = file.replace('./', '')

            let path = ''
            if (!file.startsWith('/')) {
                file = '/' + file
                path = (this.url.getFolder() ?? '') + file
            } else {
                path = file
            }
            const url = new Url(this.url.getOrigin() + path.replace(/\/\//, '/'))
            return url
        })
    }

}