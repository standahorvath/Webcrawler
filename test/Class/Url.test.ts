import {describe, expect, test} from '@jest/globals'
import {Url} from '../../src/Class/Url'
import {VALID_URLS, INVALID_URLS} from '../Data/Url'
import {absoluteUrlExact} from '../../src/Constants/Regex'

describe('Url Class', () => {
    test('Test basic valid URL', () => {
        const validUrlObject = new Url('https://www.domain.com/blog?page=1')
        const query = validUrlObject.getQuery()
        expect(validUrlObject.isValid).toBe(true)
        expect(validUrlObject.getHost()).toBe('www.domain.com')
        expect(validUrlObject.getProtocol()).toBe('https://')
        expect(validUrlObject.getOrigin()).toBe('https://www.domain.com')
        expect(validUrlObject.getPath()).toBe('/blog')
        expect(query[0].page).toBe('1')
    })

    test('Test valid URLs', () => {
        VALID_URLS.forEach((url) => {
            expect(url+":"+(new Url(url)).isValid).toBe(url+":"+true)
        })
    })

    test('Test invalid URLs', () => {
        INVALID_URLS.forEach((url) => {
            expect(url+":"+(new Url(url)).isValid).toBe(url+":"+false)
        })
    })
})