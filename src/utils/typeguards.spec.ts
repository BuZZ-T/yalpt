import { isTextFunction } from './typeguards'

describe('typeguards', () => {

    describe('isTextFunction', () => {
        it('should correctly identify a string', () => {
            expect(isTextFunction('foo')).toBe(false)
        })

        it('should correctly identify a TextFunction', () => {
            expect(isTextFunction(text => `text is: ${text}`)).toBe(true)
        })

        it('should correctly identify undefined', () => {
            expect(isTextFunction(undefined)).toBe(false)
        })
    })
})
