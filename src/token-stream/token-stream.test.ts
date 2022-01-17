import charStream, { START_POSITION } from '../char-stream/char-stream'
import { BoolToken, BraceToken, BracketToken, BuiltinTypeToken, IdentifierToken, NewlineToken, NumberToken, OperatorToken, ParenToken, PuncToken, StringToken, TokenType, WhitespaceToken } from '../token/token'
import tokenStream, { nextToken } from './token-stream'

describe('nextToken', () => {
  it('recognizes identifier tokens', () => {
    const stream = charStream('hello')
    const token = nextToken(stream)
    expect(token).toMatchObject({
      type: TokenType.Identifier,
      value: 'hello',
      range: {
        start: {
          line: 1, col: 0, index: 0
        },
        end: {
          line: 1, col: 5, index: 5
        }
      }
    })
  })

  it('recognizes identifiers with _ symbol', () => {
    const id = 'hello_world'
    const stream = charStream(id)
    const token = nextToken(stream)
    expect(token).toMatchObject({
      type: TokenType.Identifier,
      value: id,
      range: {
        start: START_POSITION,
        end: { line: 1, col: id.length, index: id.length }
      }
    })
  })

  it('recognizes built-in type names', () => {
    const names = ['Int', 'Bool', 'Unit', 'Str', 'Dbl']
    for (const n of names) {
      const stream = charStream(n)
      const token = nextToken(stream)
      expect(token).toMatchObject<BuiltinTypeToken>({
        type: TokenType.BuiltinType,
        value: n,
        range: {
          start: START_POSITION,
          end: { line: 1, col: n.length, index: n.length }
        }
      })
    }
  })

  it('recognizes keyword tokens', () => {
    const keywords = ['if', 'then', 'else', 'while', 'for', 'const', 'let', 'func']

    for (const kw of keywords) {
      const stream = charStream(kw)
      const token = nextToken(stream)
      expect(token).toMatchObject({
        type: TokenType.Keyword,
        value: kw,
        range: {
          start: { line: 1, col: 0, index: 0 },
          end: { line: 1, col: kw.length, index: kw.length }
        }
      })
    }
  })

  it('recognizes parentheses', () => {
    const stream = charStream('()')
    const tok1 = nextToken(stream)
    expect(tok1).toMatchObject<ParenToken>({
      type: TokenType.LParens,
      value: '(',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })

    const tok2 = nextToken(stream)
    expect(tok2).toMatchObject<ParenToken>({
      type: TokenType.RParens,
      value: ')',
      range: {
        start: { line: 1, index: 1, col: 1 },
        end: { line: 1, col: 2, index: 2 }
      }
    })
  })

  it('recognizes braces and brackets', () => {
    const source = '[]{}'
    const stream = charStream(source)
    
    const tok1 = nextToken(stream)
    expect(tok1).toMatchObject<BraceToken>({
      type: TokenType.LBrace,
      value: '[',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })

    const tok2 = nextToken(stream)
    expect(tok2).toMatchObject<BraceToken>({
      type: TokenType.RBrace,
      value: ']',
      range: {
        start: { line: 1, col: 1, index: 1 },
        end: { line: 1, col: 2, index: 2 }
      }
    })

    const tok3 = nextToken(stream)
    expect(tok3).toMatchObject<BracketToken>({
      type: TokenType.LBracket,
      value: '{',
      range: {
        start: { line: 1, col: 2, index: 2 },
        end: { line: 1, col: 3, index: 3 }
      }
    })

    const tok4 = nextToken(stream)
    expect(tok4).toMatchObject<BracketToken>({
      type: TokenType.RBracket,
      value: '}',
      range: {
        start: { line: 1, col: 3, index: 3 },
        end: { line: 1, col: 4, index: 4 }
      }
    })
  })

  it('recognizes colons', () => {
    const token = nextToken(charStream(':'))
    expect(token).toMatchObject<PuncToken>({
      type: TokenType.Punctuation,
      value: ':',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })
  })

  it('recognizes boolean values', () => {
    const trueToken = nextToken(charStream('true'))
    expect(trueToken).toMatchObject<BoolToken>({
      type: TokenType.Bool,
      value: 'true',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 4, index: 4 }
      }
    })

    const falseToken = nextToken(charStream('false'))
    expect(falseToken).toMatchObject<BoolToken>({
      type: TokenType.Bool,
      value: 'false',
      range: { start: START_POSITION, end: { line: 1, col: 5, index: 5 }}
    })
  })

  it('recognizes integers (no exponent)', () => {
    const stream = charStream('12345')
    const token = nextToken(stream)
    expect(token).toMatchObject<NumberToken>({
      type: TokenType.Number,
      value: '12345',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 5, index: 5 }
      }
    })
  })

  it('recognizes floating point numbers', () => {
    const stream = charStream('123.45')
    const token = nextToken(stream)
    expect(token).toMatchObject<NumberToken>({
      type: TokenType.Number,
      value: '123.45',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 6, index: 6 }
      }
    })
  })

  it('recognizes binary operators', () => {
    const operators = ['+', '-', '/', '*', '==']
    for (const op of operators) {
      const stream = charStream(op)
      const token = nextToken(stream)
      expect(token).toMatchObject<OperatorToken>({
        type: TokenType.BinaryOperator,
        value: op,
        range: {
          start: START_POSITION,
          end: { line: 1, col: op.length, index: op.length }
        }
      })
    }
  })

  it('recognizes assignment operators', () => {
    const stream = charStream('=')
    const token = nextToken(stream)
    expect(token).toMatchObject<OperatorToken>({
      type: TokenType.AssignmentOperator,
      value: '=',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })
  })

  it('recognizes the dot (.) operator', () => {
    const stream = charStream('.')
    const token = nextToken(stream)
    expect(token).toMatchObject<OperatorToken>({
      type: TokenType.DotOperator,
      value: '.',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })
  })

  it('recognizes whitespace', () => {
    const stream = charStream(' ')
    const token = nextToken(stream)
    expect(token).toMatchObject<WhitespaceToken>({
      type: TokenType.Whitespace,
      value: ' ',
      range: {
        start: START_POSITION,
        end: { line: 1, col: 1, index: 1 }
      }
    })
  })

  it('recognizes newline chars', () => {
    const stream = charStream('\n')
    const token = nextToken(stream)
    expect(token).toMatchObject<NewlineToken>({
      type: TokenType.Newline,
      value: '\n',
      range: { 
        start: START_POSITION,
        end: { line: 2, col: 0, index: 1 }
      }
    })
  })

  it('recognizes double quote strings', () => {
    const source = '"hello world"'
    const stream = charStream(source)
    const token = nextToken(stream)
    expect(token).toMatchObject<StringToken>({
      type: TokenType.String,
      value: 'hello world',
      range: {
         start: START_POSITION,
         end: { line: 1, col: 13, index: 13 }
      }
    })
  })
})

describe('tokenStream', () => {
  it('creates a token stream', () => {
    const chStream = charStream('hello')
    const tStream = tokenStream(chStream)
    expect(tStream).toBeDefined()
  })

  describe('#peek', () => {
    it('returns the next token but does not advance the stream', () => {
      const stream = tokenStream(charStream('hello world'))
      const expected: IdentifierToken = {
        type: TokenType.Identifier,
        value: 'hello',
        range: { start: START_POSITION, end: { line: 1, col: 5, index: 5 }}
      }

      const tok1 = stream.peek()
      expect(tok1).toMatchObject<IdentifierToken>(expected)

      const tok2 = stream.peek()
      expect(tok2).toMatchObject<IdentifierToken>(expected)
    })
  })

  describe('#next', () => {
    it('returns the next token and advances', () => {
      const cStream = charStream('hello world')
      const tStream = tokenStream(cStream)

      const tok1 = tStream.next()
      expect(tok1).toMatchObject<IdentifierToken>({
        type: TokenType.Identifier,
        value: 'hello',
        range: {
          start: START_POSITION,
          end: { line: 1, col: 5, index: 5 }
        }
      })

      const tok2 = tStream.next()
      expect(tok2).toMatchObject<WhitespaceToken>({
        type: TokenType.Whitespace,
        value: ' ',
        range: {
          start: { line: 1, index: 5, col: 5 },
          end: { line: 1, col: 6, index: 6 }
        }
      })

      const tok3 = tStream.next()
      expect(tok3).toMatchObject<IdentifierToken>({
        type: TokenType.Identifier,
        value: 'world',
        range: {
          start: { line: 1, col: 6, index: 6 },
          end: { line: 1, col: 11, index: 11 }
        }
      })
    })
  })
})