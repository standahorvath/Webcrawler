import { Page } from '../Class/Page'
import { Asset } from '../Class/Asset'
import { Url } from '../Class/Url'

export class BaseCrawler {
	private _settings: CrawlerSettings
	private _pages: Page[] = []
	private _assets: Asset[] = []
	private _pagesCrawled: Page[] = []
	private _assetsCrawled: Asset[] = []
	private _pagesToFollow: Page[] = []
	private _running: boolean = false
	private _activeThreads: number = 0
	private hooks: CrawlerHooks = {}

	constructor(settings: CrawlerSettings) {
		this._settings = settings
	}

	public toString(): string {
		return this._pagesCrawled.map((page) => page.getUrl().toString()).join('\n')
	}

	public getCrawledPages(): Page[] {
		return this._pagesCrawled
	}
	public getCrawledAssets(): Asset[] {
		return this._assetsCrawled
	}
	public getPages(): Page[] {
		return this._pages
	}
	public getAssets(): Asset[] {
		return this._assets
	}

	public run(hooks: CrawlerHooks): void {

		const startingPage = new Page(this._settings.startUrl)
		this._pages.push(startingPage)

		this._running = true
		this.hooks = hooks

		// Start crawling
		this.crawlingPageRunner().then(() => {
			if(this.hooks.onAllPagesLoaded) this.hooks.onAllPagesLoaded({ crawler: this })
		})
		this.crawlingAssetRunner().then(() => {
			if(this.hooks.onAllAssetsLoaded) this.hooks.onAllAssetsLoaded({ crawler: this })
		})

		//onPageLoaded({ page: new Page(this._settings.startUrl), crawler: this })
		//onAssetLoaded({ asset: new Asset(this._settings.startUrl), crawler: this })
		//onQueueEmpty({ enqueuePage: this.enquequePage, enqueueAsset: this.enquequeAsset, crawler: this })

	}

	private async crawlingPageRunner(): Promise<void> {

		if (this._pagesCrawled.length >= (this._settings.maxPages || 100)) return Promise.resolve()
		
		this._pagesToFollow.forEach((page) => {
			if (this._settings.followInternal) {
				page.getInternalLinks().forEach((url) => {
					this.enquequePage(url)
				})
			}
			if (this._settings.followExternal) {
				page.getExternalLinks().forEach((url) => {
					this.enquequePage(url)
				})
			}
		})

		while ((this._settings.maxThreads || 5) > this._activeThreads && this.canPageCrawl()) {
			this.startPageThread().then((page) => {
				if (!page) return Promise.resolve()
				if (this.hooks.onPageLoaded) this.hooks.onPageLoaded({ page, crawler: this })
				this.crawlingPageRunner()
				//console.log(page)
			}).catch((error: ErrorPage) => {
				if (this.hooks.onPageError) this.hooks.onPageError(error.page, error.error)
				console.log(error)
			})
		}
		
		Promise.resolve()

	}

	private async crawlingAssetRunner(): Promise<void> {
		while ((this._settings.maxThreads || 5) > this._activeThreads && this.canAssetCrawl()) {
			this.startAssetThread().then((asset) => {
				if (!asset) return Promise.resolve()
				if (this.hooks.onAssetLoaded) this.hooks.onAssetLoaded({ asset, crawler: this })
				this.crawlingAssetRunner()
				//console.log(asset)
			}).catch((error: ErrorAsset) => {
				if (this.hooks.onAssetError) this.hooks.onAssetError(error.asset, error.error)
				console.log(error)
			})
		}
		return Promise.resolve()
	}

	private async startPageThread(): Promise<void | Page> {
		console.log("Starts new Page thread: " + this._activeThreads)
		if (!this.canPageCrawl()) return Promise.resolve()
		console.log("Can crawl page")
		this._activeThreads++
		const page = this._pages.shift()
		if (!page) return Promise.resolve()
		try {
			await page.load()
			this._pagesCrawled.push(page)
			this._pagesToFollow.push(page)
			this._activeThreads--
			return Promise.resolve(page)
		} catch (error) {
			this._activeThreads--
			return Promise.reject({ error, page } as ErrorPage)
		}
	}

	private async startAssetThread(): Promise<void | Asset> {
		console.log("Starts new Asset thread: " + this._activeThreads)
		if (!this.canAssetCrawl()) return Promise.resolve()
		this._activeThreads++
		const asset = this._assets.shift()
		if (!asset) return Promise.resolve()
		try {
			await asset.load()
			this._assetsCrawled.push(asset)
			this._activeThreads--
			return Promise.resolve(asset)
		} catch (error) {
			this._activeThreads--
			return Promise.reject({ error, asset } as ErrorAsset)
		}
	}
	private canPageCrawl(): boolean {
		if (!this.canRun()) return false
		if (this._pagesCrawled.length >= (this._settings.maxPages || 100)) return false
		return true
	}
	private canAssetCrawl(): boolean {
		if (!this.canRun()) return false
		if (this._assetsCrawled.length >= (this._settings.maxAssets || 100)) return false
		return true
	}

	public canRun(): boolean {
		if (!this._running) return false
		if (this._pages.length + this._assets.length === 0) return false
		return true
	}

	/**
	 * Kill the crawler (stop all activity)
	 */
	public kill(): void {
		this._running = false
	}

	/**
	 * Enqueue a page to be crawled
	 * @param url Url to enqueue
	 */
	public enquequePage(url: Url): void {
		this._pages.push(new Page(url))
	}

	/**
	 * Enqueue an asset to be crawled
	 * @param url Url to enqueue
	 */
	public enquequeAsset(url: Url): void {
		this._assets.push(new Asset(url))
	}
}