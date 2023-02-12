import { Page } from '../Class/Page'
import { Asset } from '../Class/Asset'
import { Url } from '../Class/Url'
import { BaseCrawler } from '../Crawlers/BaseCrawler'
declare global {

    const enum LogLevel {
        Error = 'error',
        Warn = 'warn',
        Info = 'info',
        Debug = 'debug',
    }

    type QueryValue = {
        [key: string]: string
    }

    type CrawlerSettings = {
        startUrl: string,
        maxDepth?: number,
        maxPages?: number,
        maxAssets?: number,
        followExternal?: boolean,
        followInternal?: boolean,
        assetFolder?: string,
        maxThreads?: number,
        debug?: boolean,
    }

    type CrawlerHooks = {
        onPageLoaded?: ({ page, crawler }: { page: Page, crawler: BaseCrawler }) => void,
        onAllPagesLoaded?: ({ crawler }: { crawler: BaseCrawler }) => void,
        onAssetLoaded?: ({ asset, crawler }: { asset: Asset, crawler: BaseCrawler }) => void,
        onAllAssetsLoaded?: ({ crawler }: { crawler: BaseCrawler }) => void,
        onPageError?: (url: Page, error: Error) => void,
        onAssetError?: (url: Asset, error: Error) => void,
        onQueueEmpty?: (
            {
                enqueuePage?: (url: Url) => void,
                enqueueAsset?: (url: Url) => void,
                crawler?: BaseCrawler
            })
    }

    type ErrorPage = {
        page: Page,
        error: Error
    }
    type ErrorAsset = {
        asset: Asset,
        error: Error
    }

/*
    interface Crawler {
        run({onPageLoaded = (page: Page) => void}): Promise<void>
    }
*/
}
export {}
