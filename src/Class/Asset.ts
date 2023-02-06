import { Url } from './Url'
import fetch from 'node-fetch'
const fs = require('fs')

export class Asset {
	private url: Url
	private data: Buffer | null
	public loaded: boolean

	constructor(url: string | Url) {
		this.url = url instanceof Url ? url : new Url(url)
		this.data = null
		this.loaded = false
	}

	public getUrl(): Url {
		return this.url
	}
	
	public getData(): Buffer | null {
		return this.data
	}

	public async load(): Promise<Asset> {
		if (!this.loaded) {
			const response = await fetch(this.url.toString())
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
}