declare global {
    type Failed = {
        message: FailedMessages,
        code: FailedCodes;
    }

    const enum FailedCodes {
        ServerError = 'SERVER_ERROR',

    }

    const enum FailedMessages {
        ServerError = 'Server error',
    }

    
}
export const isFailed = (obj: any | Failed): obj is Failed => {
    return obj.code !== undefined
}
