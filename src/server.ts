import { Page } from './Class/Page'
import { Url } from './Class/Url'
import { Asset } from './Class/Asset'

export const bootstrap = () => {
		const page = new Page('https://standa.tonakodi.cz')
		page.load().then((p:Page) => {
			p.files.forEach((url:Url) => {
				const asset = new Asset(url)
				asset.load().then((a:Asset) => {
					a.save('./download/')
				})
			})
		})
}