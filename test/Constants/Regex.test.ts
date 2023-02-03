import {describe, expect, test} from '@jest/globals'
import {absoluteUrl, email, emailExact, relativeUrl} from '../../src/Constants/Regex'

describe('Absolute url Regex', () => {
    test('absoluteUrl matches absolute url', () => {
        expect(absoluteUrl.test('https://github.githubassets.com/assets/wp-runtime-fc4889327711.js?v=1.1')).toBe(true)
    })
    test('absoluteUrl does not match relative url', () => {
        expect(absoluteUrl.test('/assets/wp-runtime-fc4889327711.js?v=1.1')).toBe(false)
    })
    test('absoluteUrl does not match invalid url', () => {
        expect(absoluteUrl.test('https:/github.githubassets.com')).toBe(false)
    })
    test('absoluteUrl match case insenstitive', () => {
        expect(absoluteUrl.test('HTTPs://github.GIThubassets.com/')).toBe(true)
    })
    test('absoluteUrl match in middle of code', () => {
        expect(absoluteUrl.test('<script crossorigin="anonymous" defer="defer" type="application/javascript" src="https://github.githubassets.com/"></script>')).toBe(true)
    })
})

describe('Email Regex', () => {
    test('email matches valid email', () => {
        expect(email.test('testing@email.com')).toBe(true)
    })
    test('email does not match invalid email', () => {
        expect(email.test('testingemail.com')).toBe(false)
    })
    test('email match case insenstitive', () => {
        expect(email.test('testing@EMAIL.COM')).toBe(true)
    })
    test('email match in middle of code', () => {
        expect(email.test('<a href="mailto:testing@email.com">Testing</a>')).toBe(true)
    })
})

describe('Email Exact Regex', () => {
    test('email matches valid email', () => {
        expect(emailExact.test('testing@email.com')).toBe(true)
    })
    test('email does not match invalid email', () => {
        expect(emailExact.test('testingemail.com')).toBe(false)
    })
    test('email match case insenstitive', () => {
        expect(emailExact.test('testing@EMAIL.COM')).toBe(true)
    })
    test('email match in middle of code', () => {
        expect(emailExact.test('<a href="mailto:testing@email.com">Testing</a>')).toBe(false)
    })
})

describe('Relative url Regex', () => {
    test('relativeUrl matches relative url', () => {
        expect(relativeUrl.test('<script src="/assets/wp-runtime-fc4889327711.js?v=1.1">')).toBe(true)
    })
    test('relativeUrl does not match absolute url', () => {
        expect(relativeUrl.test('https://github.githubassets.com/assets/wp-runtime-fc4889327711.js?v=1.1')).toBe(false)
    })
    test('relativeUrl does not match invalid tag', () => {
        expect(relativeUrl.test('<imsg src=ithub.githubassets.com')).toBe(false)
    })
    test('relativeUrl match in middle of code', () => {
        expect(relativeUrl.test('<script crossorigin="anonymous" defer="defer" type="application/javascript" src="parser.json"></script>')).toBe(true)
    })
    test('relativeUrl match case insenstitive', () => {
        expect(relativeUrl.test('<IMG srC="image.png">')).toBe(false) 
    })
})