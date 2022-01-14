import charStream, { END_OF_INPUT, START_POSITION } from './char-stream'

describe('charStream', () => {
  it('creates a char stream', () => {
    const stream = charStream('')
    expect(stream).toBeDefined()
  })

  describe('#peek', () => {
    it('returns the next char but does not advance', () => {
      const stream = charStream('ab')
      expect(stream.peek()).toMatchObject({
        value: 'a',
        position: START_POSITION
      })
      expect(stream.peek()).toMatchObject({
        value: 'a',
        position: START_POSITION
      })
    })

    it('handles end of source', () => {
      const stream = charStream('')
      const char = stream.peek()
      expect(char).toMatchObject({
        value: 'END__OF__INPUT',
        position: START_POSITION
      })
    })
  })

  describe('#next', () => {
    it('returns the next char and advances the position', () => {
      const stream = charStream('ab')
      const char1 = stream.next()
      expect(char1).toMatchObject({
        value: 'a',
        position:  START_POSITION
      })

      const peeked = stream.peek()
      expect(peeked).toMatchObject({
        value: 'b',
        position: {
          line: 1,
          col: 1,
          index: 1
        }
      })
    })

    it('recognizes end of input', () => {
      const stream = charStream('a')
      stream.next()
      expect(stream.peek()).toMatchObject({
        value: END_OF_INPUT,
        position: {
          line: 1, col: 1, index: 1
        }
      })
    })
  })

  describe('#eof', () => {
    it('returns true the source has been exhausted', () => {
      const stream = charStream('a')
      expect(stream.eof()).toBe(false)
      stream.next()
      expect(stream.eof()).toBe(true)
    })
  })
})