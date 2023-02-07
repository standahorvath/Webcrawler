import { Page } from './Class/Page'
import { Url } from './Class/Url'
import { Asset } from './Class/Asset'
import { BaseCrawler } from './Crawlers/BaseCrawler'

const bootstrap = () => {
	const crawler = new BaseCrawler({ startUrl: 'https://www.google.com', maxPages: 50 })
	crawler.run({
		onPageLoaded: (page: Page) => {
			console.log(`Page loaded: ${page.getUrl()}`)
		},
		onAssetLoaded: (asset: Asset) => {
			console.log(`Asset loaded: ${asset.getUrl()}`)
		},
		onPageError: (url: Url, error: Error) => {
			console.log(`Error loading page: ${url}`)
		},
		onAssetError: (url: Url, error: Error) => {
			console.log(`Error loading asset: ${url}`)
		},
		onQueueEmpty: () => {
			console.log(`Queue empty`)
		}
	})
}

bootstrap()