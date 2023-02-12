export class Logger {
	public static log(sender: string, message: string, level: LogLevel = LogLevel.Debug): void {
		switch(level) {
			case LogLevel.Error:
				console.error(`\x1b[31m[${sender}] \x1b[37m${message}`)
				break
			case LogLevel.Warn:
				console.warn(`\x1b[33m[${sender}] \x1b[37m${message}`)
				break
			case LogLevel.Info:
				console.info(`\x1b[36m[${sender}] \x1b[37m${message}`)
				break
			case LogLevel.Debug:
				console.debug(`\x1b[32m[${sender}] \x1b[37m${message}`)
				break
		}
	}
}