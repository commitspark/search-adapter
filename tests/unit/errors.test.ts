import { ErrorCode, SearchAdapterError } from '../../src/errors.ts'

describe('SearchAdapterError', () => {
  it('should expose code and message', () => {
    const error = new SearchAdapterError(ErrorCode.BAD_REQUEST, 'Bad query')

    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('SearchAdapterError')
    expect(error.code).toBe(ErrorCode.BAD_REQUEST)
    expect(error.message).toBe('Bad query')
  })
})
