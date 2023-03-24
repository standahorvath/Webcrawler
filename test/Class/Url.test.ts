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

    test('Test query string', () => {
        const url = new Url('https://www.domain.com/blog?page=1&category=2')
        expect(url.getQuery()).toEqual([{page: '1'}, {category: '2'}])

        const url2 = new Url('https://www.domain.com/blog?page=1&category=2&category=3')
        expect(url2.getQuery()).toEqual([{page: '1'}, {category: '2'}, {category: '3'}])
    })

    test('Test query string with hash', () => {
        const url = new Url('https://www.domain.com/blog?page=1&category=2#hash')
        expect(url.getQuery()).toEqual([{page: '1'}, {category: '2'}])
        expect(url.getHash()).toBe('hash')
    })

    test('Test query string with hash and path', () => {
        const url = new Url('https://www.domain.com/robots.txt?page=1&category=2#hash?action=1')
        expect(url.getQuery()).toEqual([{page: '1'}, {category: '2'}])
        expect(url.getHash()).toBe('hash')
        expect(url.getFilename()).toBe('robots.txt')
    })

    test('Test query with PHP style', () => {
        const url = new Url('https://www.domain.com/index.php?route=product/category&path=20_27')
        expect(url.getQuery()).toEqual([{route: 'product/category'}, {path: '20_27'}])
        expect(url.getHash()).toBe(null)
        expect(url.getFilename()).toBe('index.php')
    })

    test('Test get path', () => {
        const url = new Url('https://www.domain.com/path/to/file.html')
        expect(url.getPath()).toBe('/path/to/file.html')
    })

})