import { Stream } from '../stream/stream'

export const START_POSITION = {
  line: 1,
  col: 0,
  index: 0
}

export const END_OF_INPUT = 'END__OF__INPUT'

const eof = (position: { line: number, col: number, index: number }) => {
  return {
    value: END_OF_INPUT,
    position
  }
}

export interface Char {
  value: string
  position: {
    line: number
    col: number
    index: number
  }
}

export type CharStream = Stream<Char>

const charStream = (source: string): CharStream => {
  const position = { ...START_POSITION }

  return {
    peek: () => {
      const char = source.charAt(position.index)
      if (char === '') {
        return eof(position)
      }
      return {
        value: char,
        position
      }
    },
    next: () => {
      const value = source.charAt(position.index)
      const char = {
        value,
        position: { ...position }
      }
      if (value === '\n') {
        position.line++
        position.col = 0
      } else {
        position.col++
      }
      position.index++

      return char
    },
    eof() {
      return position.index >= source.length
    }
  }
}

export default charStream