import { Url } from './Url'
import fetch from 'node-fetch'
const fs = require('fs')

export class Asset {
	private url: Url
	private data: Buffer | null
	private code: number | null
	public loaded: boolean

	constructor(url: string | Url) {
		this.url = url instanceof Url ? url : new Url(url)
		this.data = null
		this.loaded = false
		this.code = null
	}

	public getUrl(): Url {
		return this.url
	}

	public getCode(): number | null {
		return this.code
	}
	
	public getData(): Buffer | null {
		return this.data
	}

	public async load(): Promise<Asset> {
		if (!this.loaded) {
			const response = await fetch(this.url.toString())
			this.code = response.status
			this.data = await response.buffer()
			this.loaded = true
		}
		return this
	}

	public async save(path: string, filename = ''): Promise<Asset> {
		if (!this.loaded) {
			await this.load()
		}
		if (this.data == null) {
			throw new Error('Data is null')
		}
		const filePath = path + (filename == '' ? this.url.getFilename() : filename)
		console.log(filePath)
		const fileStream = fs.createWriteStream(filePath);
		await fileStream.write(this.data)
		fileStream.end()

		return this
	}
	public static parseSitemapUrl(content: string): string[] {
		const regex = /Sitemap: (.*)/gm
		let m
		let urls = [] as string[]
		while ((m = regex.exec(content)) !== null) {
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regex.lastIndex) {
				regex.lastIndex++;
			}
			if(m[1] == null) continue
			urls.push(m[1])
		}
		return urls
	}
}