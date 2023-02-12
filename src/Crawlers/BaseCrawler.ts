import { Page } from '../Class/Page'
import { Asset } from '../Class/Asset'
import { Url } from '../Class/Url'
import { Logger } from '../Class/Logger'

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
		// Check if crawler can run
		if (!this.canPageCrawl()) return Promise.resolve()

		// Increment active threads
		this._activeThreads++
		// Get next page
		const page = this._pages.shift()
		// Debug start
		if(this._settings.debug) Logger.log("Starts new Page thread", "Threads: " + this._activeThreads)
		// Check if page exists
		if (!page) return Promise.resolve()

		try {
			// Load page
			await page.load()
			// Add page to crawled pages
			this._pagesCrawled.push(page)
			// Add page to pages to follow
			this._pagesToFollow.push(page)
			// Decrement active threads
			this._activeThreads--
			if(this._settings.debug) Logger.log("Page loaded", page.getUrl().toString(), LogLevel.Info)
			if(this._settings.debug) Logger.log("End Page thread", "Threads: " + this._activeThreads)
			return Promise.resolve(page)
		} catch (error) {
			// Decrement active threads
			this._activeThreads--
			return Promise.reject({ error, page } as ErrorPage)
		}
	}

	private async startAssetThread(): Promise<void | Asset> {
		// Check if crawler can run	
		if (!this.canAssetCrawl()) return Promise.resolve()

		// Increment active threads
		this._activeThreads++
		// Get next asset
		const asset = this._assets.shift()
		// Debug message
		if(this._settings.debug) Logger.log("Starts new Asset thread", "Threads: " + this._activeThreads)
		// Check if asset exists
		if (!asset) return Promise.resolve()

		try {
			// Load asset
			await asset.load()
			// Add asset to crawled assets
			this._assetsCrawled.push(asset)
			// Decrement active threads
			this._activeThreads--
			if(this._settings.debug) Logger.log("Asset loaded", asset.getUrl().toString(), LogLevel.Info)
			if(this._settings.debug) Logger.log("End Asset thread", "Threads: " + this._activeThreads)
			// Return asset
			return Promise.resolve(asset)
		} catch (error) {
			// Decrement active threads
			this._activeThreads--
			// Return error
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
		if(this._pagesCrawled.find((page) => page.getUrl().toString() === url.toString())) return
		if(this._pages.find((page) => page.getUrl().toString() === url.toString())) return
		if(this._pagesToFollow.find((page) => page.getUrl().toString() === url.toString())) return
		this._pages.push(new Page(url))
	}

	/**
	 * Enqueue an asset to be crawled
	 * @param url Url to enqueue
	 */
	public enquequeAsset(url: Url): void {
		if(this._assetsCrawled.find((asset) => asset.getUrl().toString() === url.toString())) return
		if(this._assets.find((asset) => asset.getUrl().toString() === url.toString())) return
		this._assets.push(new Asset(url))
	}
}