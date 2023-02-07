import { Page } from '../Class/Page'
import { Asset } from '../Class/Asset'
import { Url } from '../Class/Url'

export class BaseCrawler {
	private _settings: CrawlerSettings
	private _pages: Page[] = []
	private _assets: Asset[] = []

	constructor(settings: CrawlerSettings) {
		this._settings = settings
	}

	public run({
		onPageLoaded = (page:Page) => {},
		onAssetLoaded = (asset:Asset) => {},
		onPageError = (url:Url, error:Error) => {},
		onAssetError = (url:Url, error:Error) => {},
		onQueueEmpty = (
			{
				enqueuePage = (url:Url)=>{}, 
				enqueueAsset = (url:Url)=>{}, 
				crawler = this
			}) => {}
		}): Promise<void> {
		console.log('Running crawler')

		
		onPageLoaded(new Page(this._settings.startUrl))
		onAssetLoaded(new Asset(this._settings.startUrl))
		onQueueEmpty({ enqueuePage: this.enquequePage, enqueueAsset: this.enquequeAsset, crawler: this })


		return Promise.resolve()
	}
	public enquequePage(url:Url):void {
		console.log('enqueuePage')
	}
	public enquequeAsset(url:Url):void {
		console.log('enqueueAsset')
	}
}