import { Page } from './Class/Page'
import { Url } from './Class/Url'
import { Asset } from './Class/Asset'
import { BaseCrawler } from './Crawlers/BaseCrawler'
import { Logger } from './Class/Logger'

const bootstrap = () => {
	const crawler = new BaseCrawler( 
		{ 
			startUrl: 'https://svijanychallengecup.cz/', 
			maxPages: 1, 
			maxAssets: 50, 
			maxDepth: 2, 
			followExternal: false, 
			followInternal: true, 
			assetFolder: 'assets', 
			debug: true, 
			downloadRobotsTxt: true,
			downloadSitemapXml: true,
			maxSitemaps: 2,
		})

	crawler.run({
		onPageLoaded: ({ page, crawler }) => {
			//console.log(`Page loaded: ${page.getUrl()}`)
			//Logger.log("Page Title", page.getTitleTag() || "None", LogLevel.Info)
			//Logger.log("Page Description", page.getMetaTag("description") || "None", LogLevel.Info)
			console.log(Page.extractWords(page.getData() || ""))
		},
		onAllPagesLoaded: ({ crawler }) => {
			console.log(`All pages loaded`)
		},
		onAssetLoaded: ({ asset, crawler }) => {
			console.log(`Asset loaded: ${asset.getUrl()}`)
		},
		onAllAssetsLoaded: ({ crawler }) => {
			console.log(`All assets loaded`)
		},
		onPageError: (url: Page, error: Error) => {
			console.log(`Error loading page: ${url}`)
		},
		onAssetError: (url: Asset, error: Error) => {
			console.log(`Error loading asset: ${url}`)
		},
		onRobotsTxtLoaded: ({ asset, crawler, success }) => {
			if(success){
			console.log(`Robots.txt loaded: ${asset?.getUrl() ?? 'None'}`)
			} else {
				console.log(`Robots.txt not loaded`)
			}
		},
		onSitemapXmlLoaded: ({ asset, crawler, success }) => {
			if(success){
			console.log(`Sitemap.xml loaded: ${asset?.getUrl() ?? 'None'} Code: ${asset?.getCode() ?? 'None'}`)
			} else {
				console.log(`Sitemap.xml not loaded`)
			}
		},

		/*onQueueEmpty: ({ enqueuePage, enqueueAsset, crawler}) => {
			console.log(`Queue empty`)
		}*/
	})
}

bootstrap()