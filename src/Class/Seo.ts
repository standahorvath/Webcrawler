import { Page } from "./Page"
import { imagesWithoutAlt, headingTags } from "../Constants/Regex"

export class Seo {
	public static extractImagesWithoutAlt(html: string): string[] {
		if (!html) return []

		const matches = html.match(imagesWithoutAlt)
		if (!matches) return []

		return matches.map((match) => {
			return match
		})
	}
	public static extractHeadingTags(html: string): string[] {
		if (!html) return []

		const matches = html.match(headingTags)
		if (!matches) return []

		return matches.map((match) => {
			return match
		})
	}
}