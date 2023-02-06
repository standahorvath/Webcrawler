
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
    }

    interface Crawler {
        run(): Promise<void>
    }

}
export {}
