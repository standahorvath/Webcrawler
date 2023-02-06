import { Page } from '../Class/Page'
import { Asset } from '../Class/Asset'

export class BaseCrawler implements Crawler {
	private _settings: CrawlerSettings
	private _pages: Page[] = []
	private _assets: Asset[] = []

	constructor(settings: CrawlerSettings) {
		this._settings = settings
	}
}