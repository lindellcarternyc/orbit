import { Char, CharStream } from '../char-stream/char-stream'
import { LPosition } from '../l-position'
import { Stream } from '../stream/stream'
import { BoolToken, BuiltinTypeToken, IdentifierToken, KeywordToken, NewlineToken, NumberToken, OperatorToken, StringToken, Token, TokenType, UnrecognizedToken, WhitespaceToken } from '../token/token'
import CharUtils from '../utils/char.utils'

const uncrecognized = (char: Char): UnrecognizedToken => {
  return {
    type: TokenType.Unrecognized,
    value: char.value,
    range: {
      start: char.position,
      end: char.position
    }
  }  
}

const readWhile = (predicate: (_: string) => boolean, stream: CharStream): { value: string; range: { start: LPosition; end: LPosition }} => {
  const start = { ...stream.peek().position }
  let value = ''

  while(!stream.eof() && predicate(stream.peek().value)) {
    const char = stream.next()
    value += char.value
  }

  const end = stream.peek().position

  return {
    value,
    range: { start, end }
  }
}

const isKeyword = (word: string): boolean => {
  return ['if', 'then', 'else', 'while', 'for', 'const', 'let', 'func'].includes(word)
}

const recognizeWord = (stream: CharStream): Or<KeywordToken | BoolToken | IdentifierToken | BuiltinTypeToken, UnrecognizedToken> => { 
  const word = readWhile(CharUtils.isIdChar, stream)
  const range = { ...word.range }

  if (isKeyword(word.value)) {
    return { 
      type: TokenType.Keyword,
      value: word.value,
      range
    }
  } else if (['true', 'false'].includes(word.value)) {
    return {
      type: TokenType.Bool,
      value: word.value as 'true' | 'false',
      range
    }
  } else if (['Int', 'Bool', 'Unit', 'Str', 'Dbl'].includes(word.value)) { 
    return {
      type: TokenType.BuiltinType,
      value: word.value,
      range
    }
  } else {
    return {
      type: TokenType.Identifier,
      value: word.value,
      range
    }
  }
}

const recognizePunc = (stream: CharStream): Token => {
  const char = stream.next()
  const start = { ...char.position }
  const end = { ...stream.peek().position }

  if (char.value === '(') {
    return {
      type: TokenType.LParens,
      value: '(',
      range: {
        start,
        end
      }
    }
  } else if (char.value === ')') {
    return {
      type: TokenType.RParens,
      value: ')',
      range: { start, end }
    }
  }

  if (char.value === '[') {
    return {
      type: TokenType.LBrace,
      value: '[',
      range: { start, end }
    }
  } else if (char.value === ']') {
    return {
      type: TokenType.RBrace,
      value: ']',
      range: { start, end }
    }
  }

  if (char.value === '{') {
    return {
      type: TokenType.LBracket,
      value: '{',
      range: { start, end }
    }
  } else if (char.value === '}') {
    return {
      type: TokenType.RBracket,
      value: '}',
      range: { start, end }
    }
  }

  return {
    type: TokenType.Punctuation,
    value: char.value,
    range: { start, end }
  }
}

const recognizeNumber = (stream: CharStream): NumberToken => {
  let hasDot = false
  const num = readWhile(char => {
    if (CharUtils.isDigit(char)) return true
    if (char === '.') {
      if (hasDot) return false
      hasDot = true
      return true
    }
    return false
  }, stream)
  return {
    type: TokenType.Number,
    ...num
  }
}

const recognizeOperator = (stream: CharStream): OperatorToken => {
  const char = stream.next()
  const start = { ...char.position }
  let end = { ...stream.peek().position }

  let type: TokenType = TokenType.BinaryOperator
  let value = char.value

  if (value === '=') {
    if (stream.peek().value === '=') {
      value += stream.next().value
      end = { ...stream.peek().position }
    } else {
      type = TokenType.AssignmentOperator
    }
  } else if (value === '.') { 
    type = TokenType.DotOperator
  } else {
    type = TokenType.BinaryOperator
  }

  return {
    type,
    value,
    range: { start, end }
  } as OperatorToken
}

const recognizeWhitespace = (stream: CharStream): WhitespaceToken => {
  const whitespace = readWhile(CharUtils.isWhitespace, stream)

  return {
    type: TokenType.Whitespace,
    ...whitespace
  }
}

const recognizeNewline = (stream: CharStream): NewlineToken => {
  const newline = stream.next()
  const start = { ...newline.position }
  const end = { ...stream.peek().position }

  return {
    type: TokenType.Newline,
    value: newline.value,
    range: { start, end }
  }
}

const recognizeDoubleQuote = (stream: CharStream): Or<StringToken, UnrecognizedToken> => {
  const startChar = stream.next()
  if (startChar.value !== '"') {
    return uncrecognized(startChar)
  }
  
  let value = ''
  const start = { ...startChar.position }

  const rest = readWhile(ch => ch !== '"', stream)
  value += rest.value

  const endChar = stream.next()
  if (endChar.value !== '"') {
    return uncrecognized(endChar)
  } 

  const end = { ...stream.peek().position }

  return {
    type: TokenType.String,
    value,
    range: { start, end }
  }
}

export const nextToken = (stream: CharStream): Token => {
  const nextChar = stream.peek()
  if (CharUtils.isIdChar(nextChar.value)) {
    return recognizeWord(stream)
  }

  if (CharUtils.isPunc(nextChar.value)) {
    return recognizePunc(stream)
  }

  if(CharUtils.isDigit(nextChar.value)) {
    return recognizeNumber(stream)
  }

  if(CharUtils.isOperator(nextChar.value)) {
    return recognizeOperator(stream)
  }

  if(CharUtils.isWhitespace(nextChar.value)) {
    return recognizeWhitespace(stream)
  }

  if(CharUtils.isNewline(nextChar.value)) {
    return recognizeNewline(stream)
  }

  if(nextChar.value === '"') {
    return recognizeDoubleQuote(stream)
  }
  return uncrecognized(nextChar)
}

export type TokenStream = Stream<Token>

const tokenStream = (stream: CharStream): TokenStream => {
  let currentToken: Maybe<Token> = null

  return {
    peek(): Token {
      if (currentToken === null) {
        currentToken = nextToken(stream)
      }
      return currentToken
    },
    next(): Token {
      if (currentToken !== null) {
        const token = currentToken
        currentToken = null
        return token
      }
      return nextToken(stream)
    },
    eof(): boolean {
      return currentToken === null && stream.eof()
    }
  }
}

export default tokenStream