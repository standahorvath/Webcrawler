import { Page } from './Class/Page'
import { Url } from './Class/Url'
import { Asset } from './Class/Asset'
import { BaseCrawler } from './Crawlers/BaseCrawler'

const bootstrap = () => {
	const crawler = new BaseCrawler( 
		{ 
			startUrl: 'https://www.registav.cz', 
			maxPages: 10, 
			maxAssets: 50, 
			maxDepth: 2, 
			followExternal: false, 
			followInternal: true, 
			assetFolder: 'assets', 
			debug: true, 
		})

	crawler.run({
		onPageLoaded: ({ page, crawler }) => {
			console.log(`Page loaded: ${page.getUrl()}`)
		},
		onAllPagesLoaded: ({ crawler }) => {
			console.log(`All pages loaded`)
			console.log(crawler.getCrawledPages())
		},
		onAssetLoaded: ({ asset, crawler }) => {
			console.log(`Asset loaded: ${asset.getUrl()}`)
		},
		onAllAssetsLoaded: ({ crawler }) => {
			console.log(`All assets loaded`)
			console.log(crawler.getCrawledAssets())
		},
		onPageError: (url: Page, error: Error) => {
			console.log(`Error loading page: ${url}`)
		},
		onAssetError: (url: Asset, error: Error) => {
			console.log(`Error loading asset: ${url}`)
		},
		/*onQueueEmpty: ({ enqueuePage, enqueueAsset, crawler}) => {
			console.log(`Queue empty`)
		}*/
	})
}

bootstrap()