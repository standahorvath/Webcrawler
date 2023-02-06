
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

}
export {}
